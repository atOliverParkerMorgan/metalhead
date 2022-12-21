// this class creates matches between players
import Player from "./Player";
import Game from "./Game";
import {Utils} from "./Utils";
import {ServerSocket} from "./ServerSocket";
import {Socket} from "socket.io";

// Singleton
export namespace MatchMaker {

    export let all_players_searching_1v1 = new Map<string, Player>();
    export let all_players_searching_2v2 = new Map<string, Player>();
    export let all_games= new Map<string, Game>();

    export function addPlayer1v1(socket: Socket, map_size: number){
        all_players_searching_1v1.set(socket.id, new Player(socket.id, map_size));
        findMatchFor1v1(socket, map_size);
    }

    // matches a player with another player if possible
    export function getGame1v1WithPlayer(player_token: string, map_size: number): Game | undefined{
        let current_player: Player | undefined = all_players_searching_1v1.get(player_token);

        if(current_player != null){
            let match_player: Player | undefined;
            for(let player of all_players_searching_1v1.values()) {
                if (current_player !== player) {
                    match_player = player;
                }
            }

            if(match_player == undefined) return undefined;

            const new_game = new Game(Utils.generateToken(player_token), map_size, 4);

            new_game.all_players.push(current_player);
            new_game.all_players.push(match_player);

            return new_game;
        }
    }

    export function findAiGame(socket: Socket, map_size: number){
        const game = new Game(Utils.generateToken(socket.id), map_size, 4);
        game.all_players.push(new Player(socket.id, map_size));
        all_games.set(game.token, game);

        const player: Player | undefined = game?.getPlayer(socket.id);
        if(player != null) {
            game.placeStartCity(player);


            ServerSocket.sendData(socket, {
                response_type: ServerSocket.response_types.FOUND_GAME_RESPONSE,
                data:{
                    game_token: game.token
                }
            }, player.token)

        }
    }

    export function getGame (game_token: string): Game | undefined{
        return all_games.get(game_token);
    }

    export function addPlayer2v2(nick_name: string, map_size: number){
        const player_token = Utils.generateToken(nick_name);
        all_players_searching_2v2.set(player_token, new Player(player_token, map_size));
        if(hasMatchFor1v1()){
            return [player_token, new Game(Utils.generateToken(player_token), 2500, 4)]
        }
        return player_token;
    }

    // find a game for a player if there is one
    export function findMatchFor1v1(socket: Socket, map_size: number){

        const game = foundMatch1v1(socket.id);
        if(game != null){

            const player: Player | undefined = game?.getPlayer(socket.id);
            if(player != null) {
                game.placeStartCity(player);

                ServerSocket.sendData(socket, {
                    response_type: ServerSocket.response_types.FOUND_GAME_RESPONSE,
                    data:{
                        game_token: game.token
                    }
                }, player.token)

                ServerSocket.sendDataToAll(socket, {
                    response_type: ServerSocket.response_types.FOUND_GAME_RESPONSE,
                    data:{
                        game_token: game.token
                    }
                }, player.token)
            }
        }

        if(hasMatchFor1v1()) {

            const game: Game | undefined = MatchMaker.getGame1v1WithPlayer(socket.id, map_size);
            if(game != null){

                all_games.set(game.token, game);

                const player: Player | undefined = game?.getPlayer(socket.id);
                if(player != null) {
                    game.placeStartCity(player);


                    ServerSocket.sendData(socket, {
                        response_type: ServerSocket.response_types.FOUND_GAME_RESPONSE,
                        data:{
                            game_token: game.token
                        }
                    }, player.token)

                    ServerSocket.sendDataToAll(socket, {
                        response_type: ServerSocket.response_types.FOUND_GAME_RESPONSE,
                        data:{
                            game_token: game.token
                        }
                    }, player.token)
                }
            }
        }
    }

    function hasMatchFor1v1(): boolean{
        return all_players_searching_1v1.size % 2 === 0;
    }

    function foundMatch1v1(player_token: string): Game | undefined{
        for(const game of all_games.values()){
            for(const player of game.all_players){
                if(player.token === player_token){
                    return game;
                }
            }
        }
    }

    export function getPlayerSearching1v1(player_token: string): Player | undefined{
       return all_players_searching_1v1.get(player_token);
    }

    export function hasMatchFor2v2(): boolean{
        return all_players_searching_2v2.size % 4 === 0;
    }

    export function printCurrent1v1(): void{
        for(const player_token of all_players_searching_1v1){
            console.log(player_token);
        }
    }
}