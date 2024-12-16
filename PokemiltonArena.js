const Pokemilton = require("./Pokemilton")

let equal = '============================================================'

class PokemiltonArena {
  constructor(playerPokemilton, wildPokemilton, world, player) {
    // Initialise une bataille entre deux Pokemiltons.
    // pokemilton_1 : Pokemilton contrôlé par le joueur.
    // pokemilton_2 : Pokemilton sauvage ou adversaire.
    this.pokemilton_1 = playerPokemilton
    this.pokemilton_2 = wildPokemilton
    this.world = world
    this.player = player
    this.winner = ''
    this.looser = ''
    this.round = 0
    this.battleOver = false
    
  }

  startBattle() {
    // Démarre la bataille entre les deux Pokemiltons.
    // Cette méthode orchestre les rounds jusqu'à ce qu'un gagnant soit déterminé.
    console.log(`The battle starts between ${this.pokemilton_1.name} vs ${this.pokemilton_2.name}`)
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
  
  tryToCatch() {
    // Tente de capturer le Pokemilton sauvage.
    const healthPercent = this.pokemilton_2.healthPool / this.pokemilton_2.maxHealth; // Pourcentage de santé restante
    const successChance = Math.random(); // Génère un nombre aléatoire entre 0 et 1
  
    if (this.player.POKEBALLS > 0) { // Vérifie que le joueur a des Pokéballs
      this.player.POKEBALLS--; // Consomme une Pokéball
      console.log(`🎯 You throw a Pokéball at ${this.pokemilton_2.name}...`)
      console.log(`🎾 ${this.player.POKEBALLS} Pokéball${this.player.POKEBALLS === 1 ? '' : 's'} remaining.`) // Affiche le nombre de Pokéballs restantes
  
      if (successChance > healthPercent) {
        // Capture réussie
        this.winner = this.pokemilton_1.name // Le joueur est le gagnant
        this.looser = this.pokemilton_2.name // Le Pokemilton sauvage est capturé
        console.log(`🎉 You caught ${this.pokemilton_2.name}! 🐾`); // Message de confirmation
        this.player.addPokemilton(this.pokemilton_2) // Ajoute le Pokemilton capturé à la collection du joueur
        this.world.addLog(`Day ${this.world.day}: ${this.player.name} caught ${this.pokemilton_2.name} in a battle.`);
        this.endBattle(); // Termine le combat
      } else {
        // Capture échouée
        console.log(`❌ Failed to catch ${this.pokemilton_2.name}. It’s still wild!`);
        this.wildPokemiltonAction(this.pokemilton_1) // Le Pokemilton sauvage attaque
      }
    } else {
      // Pas de Pokéballs disponibles
      console.log("⚠️ You have no Pokéballs left! You cannot catch this Pokemilton.");
    }
  }
  
  

  calculateDamage(attackRange, defenseRange, level) {
    // Calcule les dégâts infligés à un Pokemilton.
    // Utilise les statistiques d'attaque et de défense pour déterminer les dégâts finaux.
    //Algo : Nombre aléatoire entre l'attack range de l'attaquant * son niveau - le defense range du défenseur
    return Math.max(1, Math.floor((Math.random() * attackRange) * level) - defenseRange)
  }

  wildPokemiltonAction(defender) {
    // Détermine l'action du Pokemilton sauvage lors de son tour.
    // Par exemple, attaquer, esquiver ou utiliser une capacité spéciale.

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
        console.log(`${this.pokemilton_1.name} is dead. You lost loser.`);
        this.world.addLog(`Day ${this.world.day}: ${this.player.name}'s ${this.pokemilton_1.name} lost to ${this.pokemilton_2.name}.`);
        // Le joueur a perdu, on passe au jour suivant ?
        this.endBattle()
      }else if(this.pokemilton_2.healthPool <= 0){
        this.looser = this.pokemilton_2.name
        this.winner = this.pokemilton_1.name
        console.log(`${this.pokemilton_2.name} is dead. You won winner.`);
        this.world.addLog(`Day ${this.world.day}: ${this.player.name}'s ${this.pokemilton_1.name} defeated ${this.pokemilton_2.name}.`);
        // Le joueur a gagné, on donne de l'XP
        // On passe au jour suivant
        this.endBattle()
      }
    }
    

  endBattle(reason) {
    // Termine la bataille et affiche le résultat.
    // Peut inclure des récompenses ou des pénalités selon l'issue du combat.
    this.battleOver = true;
    if(reason === 'run'){
      console.log('--- Battle Over ---')
      console.log(`❌ You ran away! ${this.pokemilton_2.name} wins!`)
    }else{
      console.log(`${equal}\n                 🎉 Battle Over 🎉\n${equal}`)
      console.log(`🏆 Winner: ${this.winner}`)
      console.log(`💔 Loser: ${this.looser}`)
      if(this.looser === this.pokemilton_2.name){        
        this.pokemilton_1.gainExperience(this.pokemilton_2.level, this.world);
      }
    }
  }
}

module.exports = PokemiltonArena