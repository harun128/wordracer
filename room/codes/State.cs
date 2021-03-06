// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.30
// 

using Colyseus.Schema;

public class State : Schema {
	[Type(0, "string")]
	public string phase = "";

	[Type(1, "string")]
	public string playerTurn = "";

	[Type(2, "map", typeof(MapSchema<Player>))]
	public MapSchema<Player> players = new MapSchema<Player>();

	[Type(3, "string")]
	public string winnigPlayer = "";

	[Type(4, "string")]
	public string losingPlayer = "";

	[Type(5, "string")]
	public string question = "";

	[Type(6, "string")]
	public string answer = "";

	[Type(7, "int16")]
	public short time = 10;

	
}

