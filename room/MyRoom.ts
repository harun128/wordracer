import { Room, Client, Delayed } from "colyseus";
import { State, Player} from "./state";

import { connectDatabase, User } from "../src";



export class MyRoom extends Room<State>{
  
  maxClients = 2;

  

  playerCount : number = 0;
  public delayedInterval!: Delayed;

  onCreate (options: any) {
    let state = new State();
    state.phase = "waiting";
    state.question = "Türkiyenin başkenti neresidir";
    state.answer = "Ankara";
    state.playerTurn = "";
    state.winnigPlayer = "";
    state.losingPlayer = "";
    this.setState(state);
    connectDatabase();

  }

  async onJoin (client: Client, options: any)  {
    console.log("client joined", client.sessionId);
    console.log(options);
    let player : Player = new Player();
    const oyuncu = await User.findOne({_id:options.userId},["_id","displayName","avatarUrl","metadata"]);
  
    player.healt = 5;
    player.displayName = oyuncu.displayName;
    player.userId = Object(oyuncu._id).toString();    
    player.sessionId = client.sessionId;
    player.photo = oyuncu.avatarUrl;
    player.point = oyuncu.metadata.coins;
    
    
    



    this.state.players[client.sessionId] = player;  
    

    this.playerCount++;    

    if(this.playerCount == 2) {     
      this.state.phase = 'placed';      
      this.lock();      
    }
    
  }

  onMessage (client: Client, message: any) {
    const player = this.state.players[client.sessionId];
    //Kullanıcı tahmin et butonuna ilk bastığında
    if(message.command == "predicting"){
      this.state.playerTurn = player.userId;
      this.state.phase = "predicting";

      //Timer tanımlıyoruz
      this.clock.start();      
      this.delayedInterval = this.clock.setInterval(() => {
          this.state.time = this.state.time -1;        
          if(this.state.time == 0) {
            this.state.phase = "finished";
            this.state.losingPlayer = this.state.playerTurn;
          }
      }, 1000);
      this.clock.setTimeout(() => {
          this.delayedInterval.clear();
      }, 25_000);


    }else if(message.command =="prediction" && this.state.phase == "predicting"){
      if(player.userId == this.state.playerTurn){
        if(message.answer == this.state.answer) {
          this.state.phase = "finished";
          this.state.winnigPlayer = this.state.playerTurn;
          this.delayedInterval.clear();
        } else {
          this.state.phase = "finished";
          this.state.losingPlayer = this.state.playerTurn;
          this.state.players.array.forEach((element: Player) => {
            if(element.userId != this.state.losingPlayer){
              this.state.winnigPlayer = element.userId;
            }
          });
          this.delayedInterval.clear();
        }
      }
    }else if(message.command =="minushealt"){
      if(player.healt-1 == 0) {
        this.state.phase = "finished";
        this.state.losingPlayer = player.userId;
      } else {
        player.healt = player.healt -1;
      }
      
    }     
  }

  onLeave (client: Client, consented: boolean) {
    console.log("client left", client.sessionId);
    delete this.state.players[client.sessionId];
    this.playerCount--;
    this.disconnect();
    this.state.phase = "errorConnecting";
    console.log("oyun bitmiştir");
  }

  onDispose() {
  
  }

}
