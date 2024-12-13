const PokemiltonArena = require('./PokemiltonArena')
const Pokemilton = require('./Pokemilton')


class PokemiltonWorld {
  constructor() {
    this.day = 1
    this.logs = []
  }

  oneDayPasses(){
    this.day += 1
    console.log(`\n---- Day ${this.day} -----\n`)
  }
  
  randomizeEvent() {
    const randomEvent = 1
    if (randomEvent === 0){
      console.log ("Nothing happens, the day passes")
      this.oneDayPasses()
    }else{
      console.log("A wild pokemon appears")
      const wildPokemilton = new Pokemilton()
      return wildPokemilton
    }
  }

  addLog(newLog){
    this.logs.push(newLog)
  }
}


module.exports = PokemiltonWorld