
class PokemiltonMaster {
  constructor(name) {
    this.name = name;
    this.pokemiltonCollection = [];
    this.healingItems = 5; // Initial number of healing items
    this.reviveItems = 3; // Initial number of revive items
    this.POKEBALLS = 10; // Initial number of POKEBALLS
  }


  renamePokemilton(pokemilton, newName) {
    if (!pokemilton || !newName) {
      console.log("Invalid Pokemilton or name.")
    }
    const oldName = pokemilton.name
    pokemilton.name = newName
    console.log(`Successfully renamed ${oldName} to ${newName}.\n`)
  }

//Fonction pratique qui push le pokemon en paramètre dans le sac à dos
  addPokemilton(pokemilton) {
    this.pokemiltonCollection.push(pokemilton)
  }



  healPokemilton(pokemilton) {
    if (!pokemilton) {

      console.log("Invalid Pokemilton or name.")

       }

       else if (this.healingItems >= 1 && pokemilton.healthPool < pokemilton.maxHealth) {
        pokemilton.healthPool = pokemilton.maxHealth
        console.log('Pokemon healed')
        this.healingItems--
        console.log(`${this.healingItems} Healing object remained\n`)
       }else if (pokemilton.healthPool === pokemilton.maxHealth){
        console.log('Pokemon is already full life')
       }
    
  }

  revivePokemilton(pokemilton) {
    if (!pokemilton) {

      console.log("Invalid Pokemilton or name.")

       }

       else if (this.reviveItems >= 1 && pokemilton.healthPool === 0) {
        pokemilton.healthPool = Math.floor(pokemilton.maxHealth/2)
        console.log('Pokemon revived')
        this.reviveItems--
        console.log(`${this.reviveItems} Revive object remained\n`)
       }else if (pokemilton.healthPool > 0){
        console.log('Pokemon is already revived')
       }
    
  }

  releasePokemilton(pokemilton) {
    const index = this.pokemiltonCollection.indexOf(pokemilton); // Trouve l'index du Pokemilton
    if (index !== -1) {
      this.pokemiltonCollection.splice(index, 1); // Supprime le Pokemilton à cet index
      console.log(`${pokemilton.name} has been released from your collection.`);
    } else {
      console.log("Pokemilton not found in your collection.");
    }
  }
  
  

  showCollection() {
    //Afficher tous les pokemon de la collection
    let index = 1
    console.log(this.pokemiltonCollection)

    for (const pokemon of this.pokemiltonCollection) {
      console.log(`${index}. ${pokemon.name} - Level ${pokemon.level} - Stats: Attack Range ${pokemon.attackRange}, Defense Range ${pokemon.defenseRange}, Health Pool ${pokemon.healthPool}`)
      index++
    }
  }
}


module.exports = PokemiltonMaster
