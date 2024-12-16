const PokemiltonArena = require('./PokemiltonArena')
const Pokemilton = require('./Pokemilton')


class PokemiltonWorld {
  constructor() {
    this.day = 1
    this.logs = []
  }

  oneDayPasses(){
    this.day += 1
  }
  
  randomizeEvent() {
    const randomEvent = Math.random()
    if (randomEvent < 0.5){
      console.log ("Nothing happens, the day passes")
      this.oneDayPasses()
      
    }else{
      console.log("A wild Pokemilton appears!")
      const wildPokemilton = new Pokemilton()
      return wildPokemilton
    }
  }

  addLog(newLog){
    this.logs.push(newLog)
  }
}


module.exports = PokemiltonWorld