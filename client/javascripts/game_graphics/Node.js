import {Graphics, viewport, HEX_SIDE_SIZE, DISTANCE_BETWEEN_HEX, WORLD_WIDTH, WORLD_HEIGHT} from "./Pixi.js";

// types of nodes displayed as colors
const WATER = 0x80C5DE;
const GRASS = 0x7FFF55;
const BEACH = 0xFFFF00;
const MOUNTAIN = 0xF2F2F2;
const HIDDEN = 0xE0D257;
const CITY = 0xF53E3E;


// borders see @Map.add_neighbors_to_nodes()
const LEFT = 0;
const RIGHT = 1;
const TOP_LEFT = 2;
const TOP_RIGHT = 3;
const BOTTOM_LEFT = 4;
const BOTTOM_RIGHT = 5;


let last_selected_node_cords = [-1, -1];
export let all_nodes = [];

export class Node{
    constructor(x, y, type, line_borders, is_hidden, city) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.opacity = 1;
        this.is_hidden = is_hidden;
        this.city = city;

        this.neighbors = [];
        this.line_borders = [];
        this.line_borders_cords = line_borders;
        this.add_node_to_stage()
        if(!this.is_hidden) this.set_border(WATER, 5, 1 , this.line_borders_cords);
    }
    add_node_to_stage(){

        this.hex = new Graphics();

        if(this.city != null) this.hex.beginFill(CITY, this.opacity);
        else if(this.is_hidden) this.hex.beginFill(HIDDEN, this.opacity);
        else if(this.city != null && this.is_hidden) this.hex.beginFill(this.type, this.opacity);
        this.hex.drawRegularPolygon(this.get_x_in_pixels(), this.get_y_in_pixels(), HEX_SIDE_SIZE, 6)
            .endFill();

        this.hex.interactive = true;

        this.hex.on('pointerdown', (event) => { this.on_click() });
        this.hex.on('mouseover', (event) => { this.set_select() });

        viewport.addChild(this.hex);
    }

    get_x_in_pixels(){
        let row_bias = this.y % 2 === 0 ? DISTANCE_BETWEEN_HEX/2 : 0;
        return (this.x * DISTANCE_BETWEEN_HEX + row_bias) - WORLD_WIDTH / 2;
    }

    get_y_in_pixels(){
       return  (this.y * 1.5 * HEX_SIDE_SIZE) - WORLD_HEIGHT / 2
    }


    set_border(color, thickness, opacity, borders){
        this.line_borders.forEach(line => line.clear())
        this.line_borders = [];
        let line = new Graphics();
        line.beginFill(color, opacity);

        for(const border of borders){
            let direction_bias;
            switch (border){
                case TOP_RIGHT:
                case BOTTOM_LEFT:
                    direction_bias = border === TOP_RIGHT ? 1: -1;
                    line.position.set(this.get_x_in_pixels(), this.get_y_in_pixels());
                    line.lineStyle(thickness, color)
                        .moveTo(0, direction_bias * - HEX_SIDE_SIZE)
                        .lineTo(direction_bias * DISTANCE_BETWEEN_HEX / 2, direction_bias * - HEX_SIDE_SIZE / 2);
                    this.line_borders.push(line);
                    viewport.addChild(line);
                    break;
                case RIGHT:
                case LEFT:
                    direction_bias = border === RIGHT ? 1: -1;
                    line.position.set(this.get_x_in_pixels(), this.get_y_in_pixels());
                    line.lineStyle(thickness, color)
                        .moveTo(direction_bias * DISTANCE_BETWEEN_HEX / 2, direction_bias * - HEX_SIDE_SIZE / 2)
                        .lineTo(direction_bias * DISTANCE_BETWEEN_HEX / 2, direction_bias * HEX_SIDE_SIZE / 2);
                    this.line_borders.push(line);
                    viewport.addChild(line);
                    break;
                case BOTTOM_RIGHT:
                case TOP_LEFT:
                    direction_bias = border === BOTTOM_RIGHT ? 1: -1;
                    line.position.set(this.get_x_in_pixels(), this.get_y_in_pixels());
                    line.lineStyle(thickness, color)
                        .moveTo(direction_bias * DISTANCE_BETWEEN_HEX / 2, direction_bias * HEX_SIDE_SIZE / 2)
                        .lineTo(0, direction_bias * HEX_SIDE_SIZE);
                    this.line_borders.push(line);
                    viewport.addChild(line);
            }
        }
    }



    on_click(){
       // this.set_type(GRASS);
    }
    set_type(type){
        this.type = type;
        this.update();
    }
    set_select(){

        if(last_selected_node_cords[0] !== this.x || last_selected_node_cords[1] !== this.y) {
            if (last_selected_node_cords[0] !== -1) {
                let last_node = all_nodes[last_selected_node_cords[1]][last_selected_node_cords[0]];
                last_node.opacity = 1;
                last_node.update();
            }

            last_selected_node_cords = [this.x, this.y];
            this.opacity = .5;
            this.update();
        }
    }

    update(){
        this.hex.clear();
        this.add_node_to_stage();
        if(!this.is_hidden) this.set_border(WATER, 5, 1 , this.line_borders_cords);


    }
}