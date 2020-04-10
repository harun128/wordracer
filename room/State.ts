import {Schema , type, MapSchema, ArraySchema} from "@colyseus/schema";


export class Player extends Schema {
    @type('string')
    userId: string ;

    @type('string')
    sessionId: string ;

    @type('string')
    photo : string ;

    @type('number')
    healt : number;

    @type('string')
    displayName : string;

    @type('uint32')
    point : number;
}

export class State extends Schema {
    @type('string')
    phase: string = "waiting";

    @type('string')
    playerTurn: string = "";

    @type({ map: Player })
    players: MapSchema<Player> = new MapSchema<Player>();

    @type('string')
    winnigPlayer : string = "";

    @type('string')
    losingPlayer : string = "";

    @type('string')
    question : string = "";

    @type('string')
    answer : string = "";

    @type('int16')
    time : number = 10;
    
    
}