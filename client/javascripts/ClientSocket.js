// singleton
export const ClientSocket = {

    response_types: {
        MAP_RESPONSE: "MAP_RESPONSE",
        UNITS_RESPONSE: "UNITS_RESPONSE",
        ALL_RESPONSE: "ALL_RESPONSE",
        UNIT_MOVED_RESPONSE: "UNIT_MOVED_RESPONSE",
        MENU_INFO_RESPONSE: "MENU_INFO_RESPONSE"
    },
    request_types: {
        GET_MAP: "GET_MAP",
        GET_UNITS: "GET_UNITS",
        GET_ALL: "GET_ALL",
        GET_MENU_INFO: "GET_MENU_INFO",
        PRODUCE_UNIT: "PRODUCE_UNIT",
        MOVE_UNITS: "MOVE_UNIT",
    },
    socket: io("ws://127.0.0.1:8082", {transports: ['websocket']}),

    send_data: (data)=>{
        ClientSocket.socket.emit("send-data", data);
    },

    add_data_listener: (fun, player_token)=>{
        console.log("add_data_listener");
        ClientSocket.socket.on(player_token, (...args) => {
            console.log("RESPONSE: "+args[0].response_type);
            fun(args);
        });
    },

    get_data(request_type, game_token, player_token) {
        console.log("REQUEST: "+request_type);
        ClientSocket.socket.emit("get-data", {
            request_type: request_type,
            data: {
                game_token: game_token,
                player_token: player_token
            }
        })
    },

    set_token() {

    },
}