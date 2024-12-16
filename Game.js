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
let equal = '============================================================'
let numberCharacters = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣']

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

function loadJSON() {
  const filePath = "save.json"

  // Vérifiez si le fichier existe
  if (!fs.existsSync(filePath)) {
      console.log("No save file found. Creating a new one...")
      fs.writeFileSync(filePath, JSON.stringify({ saved_on: '' }, null, 2)) // Crée un fichier vide au besoin
      return null; // Retourne null pour indiquer qu'il n'y a pas de sauvegarde
  }

  try {
      const data = fs.readFileSync(filePath, "utf8")
      const jsonData = JSON.parse(data)

      // Vérifie si le contenu est réellement une sauvegarde valide
      if (!jsonData.saved_on || !jsonData.PokemiltonMaster) {
          console.log("Invalid save file found. Starting a new game...")
          return null // Retourne null pour démarrer une nouvelle partie
      }

      return jsonData // Retourne la sauvegarde valide
  } catch (err) {
      console.log("Error reading save file:", err.message)
      return null // Retourne null pour démarrer une nouvelle partie
  }
}

function askForName() {
  //On demande au joueur son nom
  console.clear()
  console.log(`${equal}\n                🛤️  A NEW JOURNEY BEGINS! 🛤️\n${equal}\n`)
  rl.question("🎤 What is your name, Pokemilton Master?\n💡 Enter your name: ", (playerName) => {
    console.clear()
    console.log(`\n${equal}\n                 Welcome, ${playerName}, to the world of\n                      🐾 POKEMILTON 🐾\n${equal}`)
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

  console.clear()
  console.log(`${equal}\n             🌟 Choose your first Pokemilton! 🌟\n${equal}\n`)

  function chooseFirstPokemon(){
    //Ajouter dans la collection de joueur vide de base le starter avec push
    rl.question('\n💡 Your choice: ', (chosenPokemilton) => {

      //On converti la réponse(string) de l'utilisateur en nombre(int)
      const chosenIndex = parseInt(chosenPokemilton) - 1

      //Si l'utilisateur rentre un chiffre bien compris entre le nombre de choix
      if (chosenIndex >= 0 && chosenIndex < pokemilton.length){
        //On définir une variable avec le pokémon à l'index choisit
        const selectedPokemilton = pokemilton[chosenIndex]
        //On l'ajoute dans l'instance PokemiltonMaster précédemment créé dans askforname grâce à la fonction addPokemilton créé
        player.addPokemilton(selectedPokemilton)
        console.clear()
        //Console.log
        console.log(`${equal}\n                 Congratulations, ${player.name}!\n                You chose 🐾 PieAnd as your partner!\n${equal}\n`)

        //On sauvegarde les données dans le save.json
        saveGameState()
+
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
    console.log(`${numberCharacters[i]}  🐾 ${pokemilton[i].name} - Level: ${pokemilton[i].level} | HP: ${pokemilton[i].healthPool} | ATK: ${pokemilton[i].attackRange} | DEF: ${pokemilton[i].defenseRange}`)
    pokemiltonNumber++
  }
  
  chooseFirstPokemon()
}

function choosePokemiltonTo(action, message){
  player.showCollection()
      rl.question(`\n💡 Choose a pokemon to ${message}: `, (index) => {
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
  return `\n🎮 What do you want to do today?\n${numberCharacters[0]}  Heal Pokemilton\n${numberCharacters[1]}  Revive Pokemilton\n${numberCharacters[2]}  Release Pokemilton\n${numberCharacters[3]}  Rename Pokemilton\n${numberCharacters[4]}  Do nothing\n`
}


//On fait une fonction directement dans game.js qui gère le combat et qui appelle au bon moment les méthode d'Arena
function battleFlow(playerPokemilton, wildPokemilton){
  //On créé une instance d'Arena
  const arena = new PokemiltonArena(playerPokemilton, wildPokemilton);

  //Mise en page
  console.clear()
  console.log(`${equal}\n                  ⚔️  BATTLE START ⚔️\n${equal}\n`)

  //On affiche le niveau, nom et vie du pokemon sauvage
  console.log(`🤺 Your Pokemilton: 🐾 ${playerPokemilton.name}\n(Level: ${playerPokemilton.level} | HP: ❤️  ${playerPokemilton.healthPool}/${playerPokemilton.maxHealth} | ATK: ${playerPokemilton.attackRange} | DEF: ${playerPokemilton.defenseRange})\n`)
  console.log(`💥 Wild Pokemilton: 🐾 ${wildPokemilton.name}\n(Level: ${wildPokemilton.level} | HP: ❤️  ${wildPokemilton.healthPool}    | ATK: ${wildPokemilton.attackRange} | DEF: ${wildPokemilton.defenseRange})`)

  //On créé une fonction dans la fonction de gestion du combat qui va servir à être rappelée uniquement si le combat n'est pas fini
  //Car si on ne fait pas de fonction dans la fonction BattleFlow, on devra appeller la fonction battleFlow entière lors du prochain round
  //Ce qui recréera une instance de l'Arena et rappellera la méthode startbattle qui initialisera un nouveau combat
  function handleRound() {
    if (arena.battleOver) {
        saveGameState()
        showAction();// on retourne au menu ici
        return
    }

    //On incrémente le round
    arena.round++
    //On affiche à quel round nous sommes
    console.log(`\n✨ ROUND ${arena.round} ✨`);
    //On demande à l'utilisateur s'il veut attaquer, attraper ou fuir
    console.log(`${numberCharacters[0]}  Attack\n${numberCharacters[1]}  Try to catch\n${numberCharacters[2]}  Run away\n`);

    rl.question("💡 Your choice: ", (choice) => {
      choice = parseInt(choice);
      switch (choice) {
          case 1:
            console.clear()
            console.log(`${equal}\n                    ⚔️  ATTACK PHASE ⚔️\n${equal}\n`)
            console.log(`🎯 Attacker: ${playerPokemilton.name} (ATK: ${playerPokemilton.attackRange})`)
            console.log(`🛡️  Defender: ${wildPokemilton.name} (❤️  HP: ${wildPokemilton.healthPool} | DEF: ${wildPokemilton.defenseRange})`)
            arena.attack(playerPokemilton, wildPokemilton);
            console.log(`\n${equal}`)
            if (arena.battleOver) {
              // Le combat est fini, on rappelle handleRound() pour qu’il constate battleOver et affiche le menu
              handleRound();
              break; 
            }
            // Si le combat n’est pas fini, on continue comme avant
            console.log(`🔄  ${wildPokemilton.name} counterattacks!\n`)
            arena.wildPokemiltonAction(playerPokemilton);
            console.log(`${equal}\n`)
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
              arena.endBattle('run')
              saveGameState()
              console.log("\nGame state saved, returning to menu");
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
  console.log(`${equal}\n                🌅 Day ${world.day} in Pokemilton Town 🌅\n${equal}`)
  console.log(`Trainer: ${player.name} | Pokeballs: 🎾 ${player.POKEBALLS} | Healing Items: 💊 ${player.healingItems} | Revive items: 💊 ${player.reviveItems}`)
  rl.question(menuList() + '\n💡 Your choice: ', (action) => {
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
        console.log(`\n${equal}`)
      
        let randomizeEvent = world.randomizeEvent()

        //Si un pokémon sauvage est apparu lors de la fin de la journée
        if(randomizeEvent){
          //On demande si l'utilisateur veut l'attraper ou non, si oui on comence un combat, sinon on passe le jour et on affiche le menu
          console.log(`${numberCharacters[0]}  Fight\n${numberCharacters[1]}  Run\n`)

          rl.question('💡 Your choice: ', (choice) => {
            choice = parseInt(choice)

            if(choice === 1){

              console.clear()
              console.log(`${equal}\n               🐾 Choose Your Pokemilton! 🐾\n${equal}\n`)

              //Fonction chooseFightPokemon pour choisir le pokemon, si il est mort ou invalide on relance cette fonction
              function chooseFightPokemon() {

                // Vérifie si tous les Pokemiltons sont KO
                if (player.allPokemiltonsKO()) {
                  console.log(`❌ All your Pokemiltons are KO! Use revive items or heal them before entering a battle.`);
                  world.oneDayPasses()
                  saveGameState()
                  showAction(); // Retour au menu principal
                  return;
                }

                //On demande avec quel pokémon il veut combattre
                player.showCollection()
                rl.question('\n💡 Choose a Pokemilton to fight: ', (pokemiltonChoice) => {
                  pokemiltonChoice = parseInt(pokemiltonChoice - 1)

                  if(pokemiltonChoice >= 0 && pokemiltonChoice < player.pokemiltonCollection.length){
                    const playerPokemilton = player.pokemiltonCollection[pokemiltonChoice];

                    if(playerPokemilton.healthPool === 0){
                      console.log(`❌ ${playerPokemilton.name} is KO! Choose another Pokemilton.`)
                      return chooseFightPokemon()
                    }

                    //On appelle la fonction de game.js qui gère le flux du combat
                    battleFlow(playerPokemilton, randomizeEvent)
                    
                  }else{
                    console.clear()
                    chooseFightPokemon()
                  }
                })
              }

              chooseFightPokemon()
            }
            else{
              //Run (escape)
              world.oneDayPasses()
              saveGameState()
              console.clear()
              showAction()
            }
          })
        }else{
          saveGameState()
          console.clear()
          console.log(`Nothing happened. The day passes!\n`)
          showAction()
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

function startGame() {
  console.clear()
  jsonData = loadJSON()

  if (jsonData) {
    console.log(`${equal}\n                🌟 WELCOME TO POKEMILTON 🌟\n${equal}\n`)
    console.log('📂 Previous save detected! What would you like to do?')
    console.log('1️⃣  Load previous game')
    console.log('2️⃣  Start a new adventure')

    const askChoice = () => {
      rl.question('\n💡 Your choice: ', (newBeginning) => {
        const newBeginningIndex = parseInt(newBeginning)

        if (newBeginningIndex === 1) {
          console.clear()
          // Charger la sauvegarde
          player = new PokemiltonMaster(jsonData.PokemiltonMaster.name)
          player.pokemiltonCollection = jsonData.PokemiltonMaster.pokemiltonCollection
          player.healingItems = jsonData.PokemiltonMaster.healingItems
          player.reviveItems = jsonData.PokemiltonMaster.reviveItems
          player.POKEBALLS = jsonData.PokemiltonMaster.POKEBALLS

          player.pokemiltonCollection = jsonData.PokemiltonMaster.pokemiltonCollection.map((data) => {
            const p = new Pokemilton()
            p.name = data.name
            p.level = data.level
            p.experienceMeter = data.experienceMeter
            p.attackRange = data.attackRange
            p.defenseRange = data.defenseRange
            p.healthPool = data.healthPool
            p.maxHealth = data.maxHealth
            p.catchPhrase = data.catchPhrase
            return p;
          });

          world = new PokemiltonWorld()
          world.day = jsonData.day
          world.logs = jsonData.logs

          showAction();
        } else if (newBeginningIndex === 2) {
          // Nouvelle aventure
          askForName()
        } else {
          // Entrée invalide
          console.log("❌ Invalid choice. Please enter 1 or 2.")
          askChoice() // Repose la question
        }
      });
    };

    askChoice() // Appelle la fonction pour poser la question
  } else {
    askForName()
  }
}


startGame()