const readline = require('readline');
const PokemiltonMaster = require('./PokemiltonMaster'); // Replace 'your_classes_filename' with the actual filename
const Pokemilton = require('./Pokemilton')
const PokemiltonWorld = require ('./PokemiltonWorld')
const PokemiltonArena = require ('./PokemiltonArena')
const fs = require('fs');
const { setTimeout } = require('timers/promises');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let player = {}
let world = null

  function saveGameState() {
    //On créé un objet gameData et on attribue chaque clé à la valeur de l'instance player
    const gameData = {
      saved_on: new Date().toLocaleString(),
      PokemiltonMaster: player,
      day: world.day,
      logs: world.logs
    };

  //Sauvegarde de l'objet en l'ayant stringify dans le fichier JSON avec fs
  fs.writeFileSync('save.json', JSON.stringify(gameData, null, 2))
  //On affiche un message de sauvegarde
  console.log("🔄 Game saved!\n")

}
//Fonction pour lire le fichier json
function loadJSON() {
    const filePath = "save.json";

    // Vérifiez si le fichier existe
    if (!fs.existsSync(filePath)) {
        console.log("No save file found. Creating a new one...");
        fs.writeFileSync(filePath, JSON.stringify({saved_on : ''}, null, 2)); // Crée un fichier vide au besoin
        return {}; // Retourne un objet vide comme état initial
    }

    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.log("The save file is invalid:", err.message);
        return {};
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

function choosePokemiltonTo(action, message){
  player.showCollection()
      rl.question(`\n Choose a pokemon to ${message} (enter the number):`, (index) => {
        index = parseInt(index - 1)
          if(index >= 0 && index < player.pokemiltonCollection.length){
              const pokemilton = player.pokemiltonCollection[index];
              if(message === 'rename'){
                rl.question(`Enter the new name for ${pokemilton.name}: `, (newName) => {
                  let oldName = pokemilton.name
                  if(action(pokemilton, newName)){
                    world.addLog(`Day ${world.day} : the pokemilton ${oldName} has renamed to ${newName}`)
                    saveGameState();
                  }
                  showAction();
                })
              }else{
                if(action(pokemilton)){
                  world.addLog(`Day ${world.day} : you ${message} the pokemilton ${pokemilton.name}`)
                  saveGameState()
                }
                showAction()
              }
              
          }else{
            console.log("Invalid choice. Please try again.");
            showAction();
          }
        }
      )   
}

function menuList(){
  return '\nWhat do you want to do today?\n1. Heal Pokemilton\n2. Revive Pokemilton\n3. Release Pokemilton\n4. Rename Pokemilton\n5. Do nothing\n'
}


//On fait une fonction directement dans game.js qui gère le combat et qui appelle au bon moment les méthode d'Arena
function battleFlow(playerPokemilton, wildPokemilton){
  //On créé une instance d'Arena
  const arena = new PokemiltonArena(playerPokemilton, wildPokemilton);

  //On affiche le niveau, nom et vie du pokemon sauvage
  console.log(`A wild level ${wildPokemilton.level}, ${wildPokemilton.name} appears!`);
  console.log(`It has ${wildPokemilton.healthPool} health.`);

  //On créé le combat
  arena.startBattle();


  //On créé une fonction dans la fonction de gestion du combat qui va servir à être rappelée uniquement si le combat n'est pas fini
  //Car si on ne fait pas de fonction dans la fonction BattleFlow, on devra appeller la fonction battleFlow entière lors du prochain round
  //Ce qui recréera une instance de l'Arena et rappellera la méthode startbattle qui initialisera un nouveau combat
  function handleRound() {
    if (arena.battleOver) {
        console.log("The battle has ended!")
        saveGameState()
        console.log("Game state saved. Returning to menu...")
        console.log("Menu displayed.")
        showAction();// on retourne au menu ici
        return
    }

    //On incrémente le round
    arena.round++
    //On affiche à quel round nous sommes
    console.log(`\n--- Round ${arena.round} ---`);
    //On demande à l'utilisateur s'il veut attaquer, attraper ou fuir
    console.log("Choose an action:\n1. Attack\n2. Try to catch\n3. Run away");

    rl.question("Enter your choice: ", (choice) => {
      choice = parseInt(choice);
      switch (choice) {
          case 1:
            arena.attack(playerPokemilton, wildPokemilton);
            if (arena.battleOver) {
              // Le combat est fini, on rappelle handleRound() pour qu’il constate battleOver et affiche le menu
              handleRound();
              break; 
            }
            // Si le combat n’est pas fini, on continue comme avant
            arena.wildPokemiltonAction(playerPokemilton);
            if (arena.battleOver){
              handleRound();
            }
            
            break;
          case 2:
              //Si on attrape le pokemon, on appelle la méthode pour essaye de l'attraper
              arena.tryToCatch(player);
              if (arena.battleOver){
                handleRound();
              }
              break;
          case 3:
              //S'il fuit on lui dit qu'il a fuit et on appelle la méthode qui arrête le combat
              console.log("You ran away!");
              arena.endBattle()
              console.log("Game state saved, returning to menu");
              showAction();
              break;
          default:
              console.log("Invalid choice. Please try again.");
      }

    //Si le combat n'est toujours pas fini on rappelle cette fonction pour recommencer le round
    if (!arena.battleOver) {
      handleRound(); // Lance le prochain round
    }
  })
}

//On appelle la fonction qui est dans cette fonction pour initier le combat après battlestart
handleRound()
  
}

function showAction(){
  rl.question(menuList() + '\nChoose an option (1-5) : ', (action) => {
    //Faire un switch pour appeller les fonctions du menu du jeu en fonction du choix de l'utilisateur
    action = parseInt(action)
    switch(action){
      case 1: 
        choosePokemiltonTo(player.healPokemilton.bind(player), 'heal')
        break;
      case 2:
        choosePokemiltonTo(player.revivePokemilton.bind(player), 'revive')
        break;
      case 3:
        choosePokemiltonTo(player.releasePokemilton.bind(player), 'release')
        break;
      case 4:
        choosePokemiltonTo(player.renamePokemilton.bind(player), 'rename')
        break;
      case 5:
        //Do nothing (daypasses ?
        let randomizeEvent = world.randomizeEvent()

        //Si un pokémon sauvage est apparu lors de la fin de la journée
        if(randomizeEvent){
          //On demande si l'utilisateur veut l'attraper ou non, si oui on comence un combat, sinon on passe le jour et on affiche le menu
          console.log('1. Fight\n2. Run')

          rl.question('Choose an option (1-2): ', (choice) => {
            choice = parseInt(choice)

            if(choice === 1){
              //Fight
              console.log("Let's fight")
              console.log(`A wild level ${randomizeEvent.level}, ${randomizeEvent.name} Appears! It has ${randomizeEvent.healthPool} Health`)
              player.showCollection()
              //On demande avec quel pokémon il veut combattre
              rl.question('Choose one pokemilton to fight :', (pokemiltonChoice) => {
                pokemiltonChoice = parseInt(pokemiltonChoice - 1)
                if(pokemiltonChoice >= 0 && pokemiltonChoice < player.pokemiltonCollection.length){
                    const playerPokemilton = player.pokemiltonCollection[pokemiltonChoice];
                    //On appelle la fonction de game.js qui gère le flux du combat
                    battleFlow(playerPokemilton, randomizeEvent)
                }else{
                  console.log('Invalid choice. Returning to main menu')
                  showAction()
                }
              })
            }
            
            else{
              //Run (escape)
              console.log('You chose to run away')
              world.oneDayPasses()
              saveGameState()
              showAction()
            }
          })
        }

        /*console.log(`Day ${world.day} in PokemilTown`)
        showAction()*/
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
  console.log(jsonData)
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
        
        player.pokemiltonCollection = jsonData.PokemiltonMaster.pokemiltonCollection.map(data => {
          const p = new Pokemilton();
          p.name = data.name;
          p.level = data.level;
          p.experienceMeter = data.experienceMeter;
          p.attackRange = data.attackRange;
          p.defenseRange = data.defenseRange;
          p.healthPool = data.healthPool;
          p.maxHealth = data.maxHealth;
          p.catchPhrase = data.catchPhrase;
          return p;
        });


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