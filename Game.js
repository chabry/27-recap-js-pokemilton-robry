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
let world = null



function saveGameState(){
  //Sauvegarder les données dans le fichier sauvegarde
  

  //On créé un objet gameData et on attribue chaque clé à la valeur de l'instance player
  const gameData = {
    saved_on: new Date().toLocaleString(),
    PokemiltonMaster: player,
    day: world.day,
    logs: world.logs//logs
  }

  //Sauvegarde de l'objet en l'ayant stringify dans le fichier JSON avec fs
  fs.writeFileSync('save.json', JSON.stringify(gameData, null, 2))
  //On affiche un message de sauvegarde
  console.log("🔄 Game saved!\n")

}
//Fonction pour lire le fichier json
function loadJSON() {
  const data = fs.readFileSync("save.json", "utf8");
  try {
    if(data.trim() === ''){
      console.log('Le fichier JSON est vide')
    }else{
      const jsonData = JSON.parse(data);
      return jsonData
    }
  }catch (err){
    console.log('Le fichier JSON est invalide', err.message)
    return []
  }
}


function askForName() {
  //On demande au joueur son nom
  rl.question("Welcome to the Pokemilton World! What's your name, Pokemilton Master? ", (playerName) => {
    console.log(`Hello, ${playerName}! Let your Pokemilton adventure begin! \n`)
    //On créé une nouvelle instance de la classe PokemiltonMaster et on attribue au constructeur le playerName
    player = new PokemiltonMaster(playerName)
    //On créé une nouvelle instance pokemiltonworld
    world = new PokemiltonWorld()
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

        //Afficher les actions
        showAction()
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
  console.log(player)
  chooseFirstPokemon()

}

function menuList(){
  return '\nWhat do you want to do today?\n1. Heal Pokemilton\n2. Revive Pokemilton\n3. Release Pokemilton\n4. Rename Pokemilton\n5. Do nothing\n'
}

function showAction(){
  rl.question(menuList() + '\nChoose an option (1-5) : ', (action) => {
    //Faire un switch pour appeller les fonctions du menu du jeu en fonction du choix de l'utilisateur
    action = parseInt(action)
    switch(action){
      case 1: 
      player.showCollection()
      rl.question('\n Choose a pokemon to heal (enter the number):', (index) => {
        index = parseInt(index - 1)
          if(index >= 0 && index < player.pokemiltonCollection.length){
              const pokemilton = player.pokemiltonCollection[index];
              player.healPokemilton(pokemilton)
              saveGameState()
              showAction()
      }})
        break;
      case 2:
        player.showCollection()
        rl.question('\n Choose a pokemon to revive (enter the number):', (index) => {
          index = parseInt(index - 1)
            if(index >= 0 && index < player.pokemiltonCollection.length){
              const pokemilton = player.pokemiltonCollection[index];
              player.revivePokemilton(pokemilton)
              saveGameState()
              showAction()

      }})
        break;
      case 3:

        player.showCollection()
        rl.question('\n Choose a pokemon to release (enter the number):', (index) => {
          index = parseInt(index - 1)
            if(index >= 0 && index < player.pokemiltonCollection.length){
              const pokemilton = player.pokemiltonCollection[index];
              player.releasePokemilton(pokemilton)
              saveGameState()
              showAction()
            }})
        break;
      case 4:
        player.showCollection()
        rl.question('\nChoose a Pokemilton to rename (enter the number): ', (index) => {
          index = parseInt(index - 1)
          if(index >= 0 && index < player.pokemiltonCollection.length){
            const pokemilton = player.pokemiltonCollection[index];
            rl.question('Enter the new name: ', (newName) => {
              player.renamePokemilton(pokemilton, newName)
              saveGameState()
              showAction()
            })
          }
        })
        break;
      case 5:
        //Do nothing (daypasses ?
        console.log("You decide to do nothing. The day passes")
        world.oneDayPasses()
        saveGameState()
        showAction()
        break;
      default:
        console.log('invalid choice')
        console.clear()
        showAction()
        break;
    }
  })
}

function startGame(){
  //Vérifier si une sauvegarde existe
  //Si oui on propose de la charger ou de recommencer une nouvelle
  jsonData = loadJSON()
  if(jsonData.saved_on != ''){
    console.log('Previous game found!\n')
    console.log('1. Load previous game')
    console.log('2. Start a new game')

    rl.question('Choose an option (1-2): ', (newBeginning) => {
      const newBeginningIndex = parseInt(newBeginning)

      if(newBeginningIndex === 1){
        player = new PokemiltonMaster(jsonData.PokemiltonMaster.name)
        player.pokemiltonCollection = jsonData.PokemiltonMaster.pokemiltonCollection
        player.healingItems = jsonData.PokemiltonMaster.healingItems
        player.reviveItems = jsonData.PokemiltonMaster.reviveItems
        player.POKEBALLS = jsonData.PokemiltonMaster.POKEBALLS
        
        world = new PokemiltonWorld()
        world.day = jsonData.day
        world.logs = jsonData.logs

        showAction()

      }else if(newBeginningIndex === 2){
        askForName()
      }
    })
  }else{
    askForName()
  }
}

startGame()