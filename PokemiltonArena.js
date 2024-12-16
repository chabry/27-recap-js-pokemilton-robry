const Pokemilton = require("./Pokemilton")

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

  startBattle() {
    // Démarre la bataille entre les deux Pokemiltons.
    // Cette méthode orchestre les rounds jusqu'à ce qu'un gagnant soit déterminé.
    console.log(`The battle starts between ${this.pokemilton_1.name} vs ${this.pokemilton_2.name}`)
  }

  attack(attacker, defender) {
    // Permet à un Pokemilton d'attaquer un adversaire.
    // Calcule les dégâts infligés en fonction des statistiques (attackRange, defenseRange).
    const baseDamage = Math.floor(Math.random() * (attacker.attackRange + 1))
    console.log('Base damage'+ baseDamage)
    const netDamage = Math.max(baseDamage - defender.defenseRange, 1) // Minimum 1 dégât
    console.log('Net damage'+ baseDamage)
    defender.healthPool = Math.max(0, defender.healthPool - netDamage); // Ne descend pas en dessous de 0
    console.log(`\n${attacker.name} attacks ${defender.name} for ${netDamage} damage!`)
    console.log(`Current life of the wild pokemilton : ${defender.healthPool}\n`)
    this.checkBattleStatus()
  }
  
  tryToCatch(player) {
    // Tente de capturer le Pokemilton sauvage.
    const healthPercent = this.pokemilton_2.healthPool / this.pokemilton_2.maxHealth; // Pourcentage de santé restante
    const successChance = Math.random(); // Génère un nombre aléatoire entre 0 et 1
  
    if (player.POKEBALLS > 0) { // Vérifie que le joueur a des Pokéballs
      player.POKEBALLS--; // Consomme une Pokéball
      console.log(`🎯 You throw a Pokéball at ${this.pokemilton_2.name}...`);
      console.log(`🎾 ${player.POKEBALLS} Pokéball${player.POKEBALLS === 1 ? '' : 's'} remaining.`); // Affiche le nombre de Pokéballs restantes
  
      if (successChance > healthPercent) {
        // Capture réussie
        this.winner = this.pokemilton_1.name; // Le joueur est le gagnant
        this.looser = this.pokemilton_2.name; // Le Pokemilton sauvage est capturé
        console.log(`🎉 You caught ${this.pokemilton_2.name}! 🐾`); // Message de confirmation
        player.addPokemilton(this.pokemilton_2); // Ajoute le Pokemilton capturé à la collection du joueur
        this.endBattle(); // Termine le combat
      } else {
        // Capture échouée
        console.log(`❌ Failed to catch ${this.pokemilton_2.name}. It’s still wild!`);
        this.wildPokemiltonAction(this.pokemilton_1); // Le Pokemilton sauvage attaque
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
    return Math.max(1, Math.floor((Math.random() * attackRange) * level) - defenseRange);
  }

  wildPokemiltonAction(defender) {
    // Détermine l'action du Pokemilton sauvage lors de son tour.
    // Par exemple, attaquer, esquiver ou utiliser une capacité spéciale.

    const baseDamage = Math.floor(Math.random() * (this.pokemilton_1.attackRange + 1))
    const netDamage = Math.max(baseDamage - this.pokemilton_1.defenseRange, 2); // Minimum 1 dégât
    defender.healthPool = Math.max(0, defender.healthPool - netDamage); // Ne descend pas en dessous de 0
    console.log(`\n${this.pokemilton_2.name} attacks ${defender.name} for ${netDamage} damage!`)
    console.log(`Current life of your pokemilton : ${defender.healthPool}\n`)
    this.checkBattleStatus()
  }

    // Vérifie si la bataille est terminée.
    // Retourne le statut du combat (victoire, défaite ou en cours).
    checkBattleStatus() {
      if(this.pokemilton_1.healthPool <= 0){
        this.looser = this.pokemilton_1.name
        this.winner = this.pokemilton_2.name
        console.log(`${this.pokemilton_1.name} is dead. You lost loser.`);
        // Le joueur a perdu, on passe au jour suivant ?
        this.endBattle()
      }else if(this.pokemilton_2.healthPool <= 0){
        this.looser = this.pokemilton_2.name
        this.winner = this.pokemilton_1.name
        console.log(`${this.pokemilton_2.name} is dead. You won winner.`);
        // Le joueur a gagné, on donne de l'XP
        // On passe au jour suivant
        this.endBattle()
      }
    }
    

  endBattle() {
    // Termine la bataille et affiche le résultat.
    // Peut inclure des récompenses ou des pénalités selon l'issue du combat.
    this.battleOver = true;
    if(this.looser === this.pokemilton_2.name){
      this.pokemilton_1.gainExperience(this.pokemilton_2.level);
    }
    console.log('--- Battle Over ---')
    console.log(`Winner: ${this.winner}`)
    console.log(`Looser: ${this.looser}`)
  }
}

module.exports = PokemiltonArena