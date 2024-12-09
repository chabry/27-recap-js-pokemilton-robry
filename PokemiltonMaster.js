
class PokemiltonMaster {
  constructor(name) {
    this.name = name;
    this.pokemiltonCollection = [];
    this.healingItems = 5; // Initial number of healing items
    this.reviveItems = 3; // Initial number of revive items
    this.POKEBALLS = 10; // Initial number of POKEBALLS
  }


  renamePokemilton(pokemilton) {
    
  }

//Fonction pratique qui push le pokemon en paramètre dans le sac à dos
  addPokemilton(pokemilton) {
    this.pokemiltonCollection.push(pokemilton)
  }



  healPokemilton(pokemilton) {
    
  }

  revivePokemilton(pokemilton) {
    
  }


  releasePokemilton(pokemilton) {
    
  }

  showCollection() {
    
  }
}

module.exports = PokemiltonMaster
