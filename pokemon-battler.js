class Pokemon {
  constructor(name, hitPoints, attackDamage, move={'tackle' : [attackDamage, 1]}) {
    this.name = name;
    this.hitPoints = hitPoints
    this.attackDamage = attackDamage
    this.moves = move
    this.battlePoints = 10
  }

  takeDamage(num) {
    this.hitPoints -= num
  }

  useMove(move) {
    console.log(`${this.name} uses ${move}`)
    this.battlePoints -= this.moves[move][1]

    if (this.battlePoints < 0) {
      this.hitPoints -= this.attackDamage
      this.battlePoints = -1
      console.log(`${this.name} has ran out of power points and hurt itself for ${this.attackDamage} damage`);
    }
    return this.moves[move][0]
  }

  hasFainted() {
    return this.hitPoints <= 0
  }

  printIt() {
    return `${this.constructor.name}("Name: ${this.name}", HP: ${this.hitPoints}, Damage: ${this.attackDamage}, Moveset: "${Object.keys(this.moves)}") Battle points: ${this.battlePoints}`;
  }
}

class FirePokemon extends Pokemon{
  constructor (name, hitPoints, attackDamage, moves) {
    super(name, hitPoints, attackDamage, moves)
    this.type = "fire"
  }

  isEffectiveAgainst (pokemon) {
    return pokemon.type === "grass";
  }

  isWeakTo (pokemon) {
    return pokemon.type === "water";
  }
}

class WaterPokemon extends Pokemon{
  constructor (name, hitPoints, attackDamage, moves) {
    super(name, hitPoints, attackDamage, moves)
    this.type = "water"
  }

  isEffectiveAgainst (pokemon) {
    return pokemon.type === "fire";
  }

  isWeakTo (pokemon) {
    return pokemon.type === "grass";
  }
}

class GrassPokemon extends Pokemon{
  constructor (name, hitPoints, attackDamage, moves) {
    super(name, hitPoints, attackDamage, moves)
    this.type = "grass"
  }

  isEffectiveAgainst (pokemon) {
    return pokemon.type === "water";
  }

  isWeakTo (pokemon) {
    return pokemon.type === "fire"
  }
}

class NormalPokemon extends Pokemon{
  constructor (name, hitPoints, attackDamage, moves) {
    super(name, hitPoints, attackDamage, moves)
    this.type = "normal"
  }

  isEffectiveAgainst () {
    return false;
  }

  isWeakTo () {
    return false;
  }
}

class Pokeball {
  constructor() {
    this.pokemon = null
  }

  throw(pokemon) {
    if (pokemon && !this.pokemon) {
      console.log(`You caught ${pokemon.name}!`)
      this.pokemon = pokemon
    } else {
      if (this.pokemon) {
        console.log(`GO ${this.pokemon.name}!!`)
        return this.pokemon
      } else {
        console.log("Your pokeball is empty!")
      }
    }
  }


  isEmpty() {
    return this.pokemon === null
  }


  contains() {
    if (this.pokemon) {
      return this.pokemon.name
    } else {
      return 'empty...'
    }
  }

  printIt () {
    return `Pokeball: ${this.pokemon.printIt()}`
  }
}

class Trainer {
  constructor(name) {
    this.name = name
    this.belt = new Map()
    this.emptyBalls = 6
  }

  catch(pokemon) {
    if (this.emptyBalls > 0) {
      const newBall = new Pokeball()
      newBall.throw(pokemon)
      this.belt.set(pokemon.name, newBall)
      this.emptyBalls--
      return

      } else {
        return "No empty balls"
    }
  }

  getPokemon(pokemonName) {
    if (this.belt.has(pokemonName)) {
      return this.belt.get(pokemonName).throw()
    }

    console.log("You do not have this pokemon!")
    }
}


class Battle {
  constructor (trainerOne, trainerTwo, trainerOnePokemon, trainerTwoPokemon) {
    this.trainerOne = trainerOne
    this.trainerTwo = trainerTwo
    this.trainerOnePokemon = trainerOne.getPokemon(trainerOnePokemon)
    this.trainerTwoPokemon = trainerTwo.getPokemon(trainerTwoPokemon)
  }

  fight (move, attacker = this.trainerOnePokemon, defender = this.trainerTwoPokemon) {

    let damage = 0

    if (attacker.isEffectiveAgainst(defender)) {
      damage = Math.floor(attacker.useMove(move) * 1.25)
    } else if (defender.isEffectiveAgainst(attacker)) {
      damage = (Math.floor(attacker.useMove(move) * 0.75))
    } else {
      damage = attacker.useMove(move)
    }

    let critical = Math.round(Math.random() * 10)

    if (critical < 2) {
      critical = true
    } else {
      critical = false
    }

    if (critical) damage *= 3

    if (attacker.battlePoints > 0) {
      defender.hitPoints -= damage
      const isItCritical = critical ? " critical" : ""
      console.log(`to${isItCritical} hit ${defender.name} for ${damage} damage`);
    }

    if (this.trainerOnePokemon.hasFainted()) {
      this.trainerOne.belt.delete(this.trainerOnePokemon.name)
      return `${this.trainerTwo.name} has won the battle!`
    }
    if (this.trainerTwoPokemon.hasFainted()) {
      this.trainerTwo.belt.delete(this.trainerTwoPokemon.name)
      return `${this.trainerOne.name} has won the battle!`
    }

    return "Next turn"
  }
}


module.exports = {Pokemon : Pokemon, FirePokemon: FirePokemon, WaterPokemon: WaterPokemon,
    GrassPokemon: GrassPokemon, NormalPokemon: NormalPokemon, Pokeball: Pokeball, Trainer: Trainer,Battle: Battle}
