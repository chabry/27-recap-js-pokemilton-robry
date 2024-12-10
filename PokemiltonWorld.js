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
    
  }

  addLog(newLog){
    this.logs.push(newLog)
  }
}


module.exports = PokemiltonWorld