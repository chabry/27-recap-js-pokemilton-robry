const readline = require('readline');
const PokemiltonMaster = require('./PokemiltonMaster'); // Replace 'your_classes_filename' with the actual filename
const Pokemilton = require('./Pokemilton')
const PokemiltonWorld = require ('./PokemiltonWorld')
const fs = require('fs');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let player = ''
let pokemiltonOwn = []


function saveGameState(){
  
}

function askForName() {
  rl.question("Welcome to the Pokemilton World! What's your name, Pokemilton Master? ", (answer) => {
    console.log(`Hello, ${answer}! Let your Pokemilton adventure begin!`)
    player = answer
    proposeFirstPokemilton(answer)
  }
)}

function proposeFirstPokemilton(){
  const pokemilton = []
  let pokemiltonNumber = 1

  for(let i = 0; i < 3; i++){
    pokemilton[i] = new Pokemilton
    console.log(`${pokemiltonNumber}. ${pokemilton[i].name} - Level ${pokemilton[i].level} - Stats: Attack Range ${pokemilton[i].attackRange}, Defense Range ${pokemilton[i].defenseRange}, Health Pool ${pokemilton[i].healthPool}`)
    pokemiltonNumber++
  }

  rl.question('Choose your first Pokemilton (1-3): ', (choose) => {
    pokemiltonOwn += pokemilton[choose]
  })
}

function startGame(){
  //Demander le nom d'utilisateur
  proposeFirstPokemilton()
  console.log(pokemiltonOwn)

  //Demander quel pokemon l'utilsateur souhaite

}


startGame()

