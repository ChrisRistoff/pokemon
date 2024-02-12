// import { input } from '@inquirer/prompts';
// import { select } from '@inquirer/prompts';
// import {Pokemon, FirePokemon, WaterPokemon, GrassPokemon, NormalPokemon,
//     Pokeball, Trainer, Battle} from './pokemon-battler.js'
// import {pokeLogo, pickPokemon, done, bye} from './art.js'
// import { meowthMoves, bulbasaurMoves, squirtleMoves, charmanderMoves, leafeonMoves, vaporeonMoves, flareonMoves, eeveeMoves } from './moves.js';

const { input } = require('@inquirer/prompts');
const { select } = require('@inquirer/prompts');
const {Pokemon, FirePokemon, WaterPokemon, GrassPokemon, NormalPokemon,
    Pokeball, Trainer, Battle} = require('./pokemon-battler.js')
const {pokeLogo, pickPokemon, done, bye} = require ('./art.js')
const { meowthMoves, bulbasaurMoves, squirtleMoves, charmanderMoves, leafeonMoves, vaporeonMoves, flareonMoves, eeveeMoves} = require('./moves.js');



console.log(pokeLogo);


const createTrainers = async (num) => {
  let response = ""

  while(!response) {
    response = await input({
      type: 'text',
      name: 'name',
      message: `Trainer ${num} what is your name?`
    });
  }

  return new Trainer(response);
}

const selectPokemon = async (trainerOne, trainerTwo) => {

  const pokemons = {
    "Eevee" : new NormalPokemon("Eevee", 55, 55, eeveeMoves),
    "Flareon": new FirePokemon("Flareon", 65, 20, flareonMoves),
    "Vaporeon": new WaterPokemon("Vaporeon", 70, 19, vaporeonMoves),
    "Leafeon": new GrassPokemon("Leafeon", 65, 17, leafeonMoves),
    "Charmander": new FirePokemon("Charmander", 44, 17, charmanderMoves),
    "Squirtle": new WaterPokemon("Squirtle", 44, 16, squirtleMoves),
    "Bulbasaur" : new GrassPokemon("Bulbasaur", 45, 16, bulbasaurMoves),
    "Meowth": new NormalPokemon("Meowth", 55, 17, meowthMoves)
  }

    for (let i = 0; i < 8; i++) {
        const currentTrainer = i % 2 === 0 ? trainerOne : trainerTwo

        const answer = await select({
            type: 'select',
            name: 'pokemon',
            message: `${currentTrainer.name} select a Pokemon to catch!`,
            choices: Object.keys(pokemons).map(key => ({
                title: key,
                value: key,
                description: pokemons[key].printIt()
      }))
        });

        currentTrainer.catch(pokemons[answer]);
        delete pokemons[answer];
    }
    return [trainerOne, trainerTwo];
}

const selectPokemonForBattle = async (trainer) => {

  const answer = await select({
    type: 'select',
    name: 'pokemon',
    message: `${trainer.name} select your pokemon for the battle!`,
    choices: [...trainer.belt.entries()].map(([key, value]) => ({
      title: key,
      value: key,
      description: value.printIt()
    }))
  });

  return answer
}

const main = async () => {
  let again = ""
  while (again !== "no") {

    let trainer = await createTrainers(1);
    let trainer2 = await createTrainers(2);

    [trainer, trainer2] = await selectPokemon(trainer, trainer2);
    let pokemon1
    let pokemon2

    let selectAgain = "."
    let round = 0
    let prevBattle = "Next turn"
    while (trainer.belt.size !== 0 && trainer2.belt.size !== 0) {

      console.log(pickPokemon);

      if (selectAgain === "." || prevBattle !== "Next turn") {
        pokemon1 = await selectPokemonForBattle(trainer)
        selectAgain = "."
      }

      while (selectAgain !== "no" && selectAgain !== ".") {
        selectAgain = "."

        if (selectAgain === ".")
          selectAgain = await select({
            type: 'select',
            message: `${trainer.name} would you like to select a new Pokemon`,
            choices: [{
              title: "Keep the same Pokemon",
              value: "no",
              description: "Stay with the same Pokemon",
            },
            {
              title: "New pokemon",
              value: "yes",
              description: "Select a new Pokemon"
            }
          ]
        });

        if (selectAgain === "yes") {
          pokemon1 = await selectPokemonForBattle(trainer)
          selectAgain === ""
          let tempTrainer = trainer
          trainer = trainer2
          trainer2 = tempTrainer

          let tempPokemon = pokemon1
          pokemon1 = pokemon2
          pokemon2 = tempPokemon
        }

      }

      if (!round) {
        pokemon2 = await selectPokemonForBattle(trainer2)
      }

      round = 1

      const battle = new Battle(trainer, trainer2, pokemon1, pokemon2)

      const move = await select({
            type: 'select',
            name: 'move',
            message: `${trainer.name} select a move for ${battle.trainerOnePokemon.name}, ${battle.trainerOnePokemon.name} has ${battle.trainerOnePokemon.battlePoints} Battle Points left`,
            choices: Object.keys(battle.trainerOnePokemon.moves).map(key => ({
                title: key,
                value: key,
                description: `Damage: ${battle.trainerOnePokemon.moves[key][0]} Battle Points:${battle.trainerOnePokemon.moves[key][1]}`
      }))
        });

      prevBattle = battle.fight(move)
      if (prevBattle !== "Next turn") round = 0
      console.log(prevBattle);
      let tempTrainer = trainer
      trainer = trainer2
      trainer2 = tempTrainer

      let tempPokemon = pokemon1
      pokemon1 = pokemon2
      pokemon2 = tempPokemon
      selectAgain = ""
    }

    if (trainer.belt.size === 0) {
      console.log(`${trainer2.name} has won the war with ${trainer2.belt.size} pokemons left`);
    } else {
      console.log(`${trainer.name} has won the war with ${trainer.belt.size} pokemons left`);
    }

    console.log(done);
    again = await select({
      type: 'select',
      message: `Would you like to play again?`,
      choices: [{
        title: "YES PLEASE",
        value: "yes",
        description: "Play the game again",
      },
      {
        title: "NO MORE",
        value: "no",
        description: "Rage quit the game"
      },
      {
        title: "BACK TO MAIN MENU",
        value: "menu",
        description: "Go back to the main menu",
      }
    ]
    });

    if (again === "menu") return mainMenu()
  }

  console.log(bye);
};

const mainMenu = async () => {
  let play
  while(play !== "play" && play !== "quit") {

    play = await select({
      type: 'select',
      message: `MAIN MENU`,
      choices: [{
        title: "PLAY",
        value: "play",
        description: "Play the game",
      },
      {
        title: "CREDITS",
        value: "credits",
        description: "Get to know the team",
      },
      {
        title: "QUIT",
        value: "quit",
        description: "Quit the game"
      }
      ]
    });

    if (play === "credits") {
      console.log("KR: CTO, Lead dev, art director, tester, janitor, assistant");
    }
  }

  if (play === "play") {
    await main()
  } else {
    console.log(bye);
  }
}

mainMenu()


module.exports = {createTrainers, selectPokemon, selectPokemonForBattle,
main, mainMenu}
