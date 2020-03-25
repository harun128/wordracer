// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 0.5.30
// 

using Colyseus.Schema;

public class Player : Schema {
	[Type(0, "string")]
	public string userId = "";

	[Type(1, "string")]
	public string sessionId = "";

	[Type(2, "string")]
	public string photo = "";

	[Type(3, "number")]
	public float healt = 0;

	[Type(4, "string")]
	public string displayName = "";

	[Type(5, "uint32")]
	public uint point = 0;
}

