const City = require("./City").City;

const WATER = 0x80C5DE;
const GRASS = 0x7FFF55;
const BEACH = 0xFFFF00;
const MOUNTAIN = 0xF2F2F2;

class Continent{
    constructor(name, map) {
        this.name = name;
        this.map = map;

        this.all_nodes = [];

        this.grass_nodes = [];
        this.has_player = false;

        this.beach_nodes = [];
        this.mountain_nodes = [];
    }
    add_player_city(player){
        if(!this.has_player){
            const city_node = this.get_random_node_of_type(GRASS);
            city_node.city = new City(player);
            city_node.neighbors.forEach((node) => node.is_shown.push(player.token));

            this.has_player = true;
        }
    }

    add_grass_node(node){
        node.type = GRASS;

        this.grass_nodes.push(node);
        this.all_nodes.push(node);
    }
    remove_grass_node(node){
        this.grass_nodes.splice(this.grass_nodes.indexOf(node), 1);
        this.all_nodes.splice(this.grass_nodes.indexOf(node), 1);
    }

    add_beach_node(node){
        node.type = BEACH;

        this.beach_nodes.push(node);
        this.all_nodes.push(node);
    }
    remove_beach_node(node){
        this.beach_nodes.splice(this.beach_nodes.indexOf(node), 1);
        this.all_nodes.splice(this.beach_nodes.indexOf(node), 1);
    }

    add_mountain_node(node){
        node.type = MOUNTAIN;

        this.mountain_nodes.push(node);
        this.all_nodes.push(node);
    }
    remove_mountain_node(node){
        this.mountain_nodes.splice(this.mountain_nodes.indexOf(node), 1);
        this.all_nodes.splice(this.mountain_nodes.indexOf(node), 1);
    }

    change_node_to(node, new_type){
        if(node.type === new_type) return;

        const old_type = node.type;

        switch (new_type){
            case GRASS:
                this.add_grass_node(node);
                break;
            case BEACH:
                this.add_beach_node(node);
                break;
            case MOUNTAIN:
                this.add_mountain_node(node);
                break;
        }

        switch (old_type){
            case GRASS:
                this.remove_grass_node(node);
                break;
            case BEACH:
                this.remove_beach_node(node);
                break;
            case MOUNTAIN:
                this.remove_mountain_node(node);
                break;
        }
    }
    get_random_node(){
        if(this.all_nodes.length === 0) return null;
        return this.all_nodes[this.random_int(0, this.all_nodes.length-1)];
    }
    get_random_node_of_type(type){
        switch (type){
            case GRASS:
                if(this.grass_nodes.length === 0) return null;
                return this.grass_nodes[this.random_int(0, this.grass_nodes.length-1)];
            case BEACH:
                if(this.beach_nodes.length === 0) return null;
                return this.beach_nodes[this.random_int(0, this.beach_nodes.length-1)];
            case MOUNTAIN:
                if(this.mountain_nodes.length === 0) return null;
                return this.mountain_nodes[this.random_int(0, this.mountain_nodes.length-1)];
        }
    }

    // @TODO get rid of duplicate
    random_int(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}


module.exports = Continent;