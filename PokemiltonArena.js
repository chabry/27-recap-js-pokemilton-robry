const Pokemilton = require("./Pokemilton")

let equal = '============================================================'

class PokemiltonArena {
  constructor(playerPokemilton, wildPokemilton) {
    // Initialise une bataille entre deux Pokemiltons.
    // pokemilton_1 : Pokemilton contrôlé par le joueur.
    // pokemilton_2 : Pokemilton sauvage ou adversaire.
    this.pokemilton_1 = playerPokemilton
    this.pokemilton_2 = wildPokemilton
    this.winner = ''
    this.looser = ''
    this.round = 0
    this.battleOver = false
    
  }

  attack(attacker, defender) {
    // Permet à un Pokemilton d'attaquer un adversaire.
    // Calcule les dégâts infligés en fonction des statistiques (attackRange, defenseRange).
    const damage = this.calculateDamage(this.pokemilton_1.attackRange, this.pokemilton_2.defenseRange, this.pokemilton_1.level)
    defender.healthPool = Math.max(0, defender.healthPool - damage); // Ne descend pas en dessous de 0
    console.log(`\n🎲 Damage dealt: ${damage}`)
    console.log(`❤️  ${this.pokemilton_2.name}'s Remaining HP: **${this.pokemilton_2.healthPool}**`)
    this.checkBattleStatus()
  }

  tryToCatch(player) {
    // Tente de capturer le Pokemilton sauvage.
    // Le succès dépend de certains facteurs tels que la santé restante du Pokemilton.

    const healthPercent = this.pokemilton_2.healthPool / this.pokemilton_2.maxHealth
    const successChance = Math.random()

    if ( player.POKEBALLS > 0) {
      player.POKEBALLS-- // réduit le nombre de pokéball de 1

      if(successChance > healthPercent) {
        this.looser = this.pokemilton_2.name
        this.winner = this.pokemilton_1.name
        console.log(`You caught ${this.pokemilton_2.name}!`)
        player.addPokemilton(this.pokemilton_2)
        this.endBattle()
  
      }else{
        console.log(`\nFailed to catch ${this.pokemilton_2.name}!`)
        console.log(`You have ${player.POKEBALLS} pokeballs left\n`)
      }
    }
    if(player.POKEBALLS === 0){
      console.clear()
      console.log('\nImpossible to try to catch. No pokeballs lefts')
    }
    this.wildPokemiltonAction(this.pokemilton_1)
  }

  calculateDamage(attackRange, defenseRange, level) {
    // Calcule les dégâts infligés à un Pokemilton.
    // Utilise les statistiques d'attaque et de défense pour déterminer les dégâts finaux.
    //Algo : Nombre aléatoire entre l'attack range de l'attaquant * son niveau - le defense range du défenseur
    return Math.max(1, Math.floor((Math.random() * attackRange) * level) - defenseRange);
  }

  wildPokemiltonAction(defender) {
    //Contre attaque du pokémon
    const damage = this.calculateDamage(this.pokemilton_1.attackRange, this.pokemilton_2.defenseRange, this.pokemilton_1.level)
    defender.healthPool = Math.max(0, defender.healthPool - damage); // Ne descend pas en dessous de 0
    console.log(`🎯 Damage dealt: **${damage}**`)
    console.log(`❤️  ${this.pokemilton_1.name}'s HP: **${this.pokemilton_1.healthPool}/${this.pokemilton_1.maxHealth}**`)
    this.checkBattleStatus()
  }

    // Vérifie si la bataille est terminée.
    // Retourne le statut du combat (victoire, défaite ou en cours).
    checkBattleStatus() {
      if(this.pokemilton_1.healthPool <= 0){
        this.looser = this.pokemilton_1.name
        this.winner = this.pokemilton_2.name
        this.endBattle()
      }else if(this.pokemilton_2.healthPool <= 0){
        this.looser = this.pokemilton_2.name
        this.winner = this.pokemilton_1.name
        this.endBattle()
      }
    }
    

  endBattle(reason) {
    // Termine la bataille et affiche le résultat.
    // Peut inclure des récompenses ou des pénalités selon l'issue du combat.
    this.battleOver = true;

    console.clear()

    if(reason === 'run'){
      console.log('--- Battle Over ---')
      console.log(`❌ You ran away! ${this.pokemilton_2.name} wins!`)
    }else{
      console.log(`${equal}\n                 🎉 Battle Over 🎉\n${equal}`)
      console.log(`🏆 Winner: ${this.winner}`)
      console.log(`💔 Loser: ${this.looser}`)
      if(this.looser === this.pokemilton_2.name){        
        this.pokemilton_1.gainExperience(this.pokemilton_2.level);
      }
    }

  }
}

module.exports = PokemiltonArena