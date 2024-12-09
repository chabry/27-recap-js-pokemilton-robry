const readline = require('readline');
const PokemiltonMaster = require('./PokemiltonMaster'); // Replace 'your_classes_filename' with the actual filename
const Pokemilton = require('./Pokemilton')
const PokemiltonWorld = require ('./PokemiltonWorld')
const fs = require('fs');
const { setTimeout } = require('timers/promises');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let player = {}


async function saveGameState(){
  //Sauvegarder les données dans le fichier sauvegarde

  //On créé un objet gameData et on attribue chaque clé à la valeur de l'instance player
  const gameData = {
    name: player.name,
    pokemiltonCollection: player.pokemiltonCollection,
    healingItems: player.healingItems,
    reviveItems: player.reviveItems,
    POKEBALLS: player.POKEBALLS
  }
  
  //On affiche un message de sauvegarde
  console.log("🔄 Game is saving. Please don't quit.\n")


  //Petit timeout grace à la fonction async pour faire joli
    try{
      await setTimeout(1000)
      //Sauvegarde de l'objet en l'ayant stringify dans le fichier JSON avec fs
      fs.writeFileSync('save.json', JSON.stringify(gameData, null, 2))
      //On affiche que le fichier est bien sauvegardé
      console.log('Game saved!\n')
    } catch (error) {
      console.error("An error as occured with the save", error)
    }
}


function askForName() {
  //On demande au joueur son nom
  rl.question("Welcome to the Pokemilton World! What's your name, Pokemilton Master? ", (playerName) => {
    console.log(`Hello, ${playerName}! Let your Pokemilton adventure begin! \n`)
    //On créé une nouvelle instance de la classe PokemiltonMaster et on attribue au constructeur le playerName
    player = new PokemiltonMaster(playerName)
    //On lance la fonction pour proposer les starters
    proposeFirstPokemilton()
  }
)}

function proposeFirstPokemilton(){
  const pokemilton = []
  let pokemiltonNumber = 1

  function chooseFirstPokemon(){
    //Ajouter dans la collection de joueur vide de base le starter avec push
    rl.question('\nChoose your first Pokemilton (1-3): ', (chosenPokemilton) => {

      //On converti la réponse(string) de l'utilisateur en nombre(int)
      const chosenIndex = parseInt(chosenPokemilton) - 1

      //Si l'utilisateur rentre un chiffre bien compris entre le nombre de choix
      if (chosenIndex >= 0 && chosenIndex < pokemilton.length){
        //On définir une variable avec le pokémon à l'index choisit
        const selectedPokemilton = pokemilton[chosenIndex]
        //On l'ajoute dans l'instance PokemiltonMaster précédemment créé dans askforname grâce à la fonction addPokemilton créé
        player.addPokemilton(selectedPokemilton)
        //On sauvegarde les données dans le save.json
        saveGameState()
      }
      
      else{
        //Sinon on rappelle la fonction pour qu'il choisise des pokémons
        console.log("This Pokemilton doesn't exist")
        chooseFirstPokemon()
      }
    })
    }

  //Afficher 3 starter généré aléatoirement
  for(let i = 0; i < 3; i++){
    pokemilton[i] = new Pokemilton
    console.log(`${pokemiltonNumber}. ${pokemilton[i].name} - Level ${pokemilton[i].level} - Stats: Attack Range ${pokemilton[i].attackRange}, Defense Range ${pokemilton[i].defenseRange}, Health Pool ${pokemilton[i].healthPool}`)
    pokemiltonNumber++
  }

  chooseFirstPokemon()

}

function startGame(){
  //Vérifier si une sauvegarde existe
  //Si oui on propose de la charger ou de recommencer une nouvelle
  //Si non on créé une nouvelle
  //Demander le nom d'utilisateur
  askForName()
  //Proposer les Starter
  //Demander quel pokemon l'utilsateur souhaite
}

startGame()