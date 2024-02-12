const { Pokemon, FirePokemon, WaterPokemon, GrassPokemon, NormalPokemon,
    Pokeball, Trainer, Battle} = require("../pokemon-battler")

const { meowthMoves, bulbasaurMoves, squirtleMoves, charmanderMoves, leafeonMoves, vaporeonMoves, flareonMoves, eeveeMoves } = require('../moves.js');


describe('test Pokemon class', () => {
  describe('Pokemon properties', () => {
    it('should give us the proper properties of the class', () => {
      const pokemon = new Pokemon("Pikachu", 100, 20)

      expect(pokemon.name).toBe("Pikachu")
      expect(pokemon.hitPoints).toBe(100)
      expect(pokemon.attackDamage).toBe(20)
      expect(pokemon.moves).toEqual({"tackle": [20, 1]})
    })

    it("should instantiate the correct moves list from list of moves", () => {
      const meowth = new Pokemon("Meowth", 100, 20, meowthMoves)
      expect(meowth.moves).toEqual({
        "Tackle" : [18, 1],
        "Scratch" : [23, 2],
        "Death purr" : [27, 3]
      })
      expect(meowth.moves['Death purr'][0]).toBe(27)
    })
  })

  describe('Pokemon methods', () => {
    it('should change hitPoints when damage is taken', () => {
      const pokemon = new Pokemon("Pikachu", 100, 20)
      pokemon.takeDamage(20)
      expect(pokemon.hitPoints).toBe(80)
      expect(pokemon.useMove('tackle')).toBe(20)
      expect(pokemon.hasFainted()).toBe(false)
      pokemon.takeDamage(80)
      expect(pokemon.hasFainted()).toBe(true)
      pokemon.takeDamage(80)
      expect(pokemon.hasFainted()).toBe(true)
    })

    it("Expect battle points to be properly deducted upon use of a move", () => {
      const meowth = new Pokemon("Meowth", 100, 20, meowthMoves)
      expect(meowth.battlePoints).toBe(10)
      meowth.useMove('Death purr')
      expect(meowth.battlePoints).toBe(7)
    })
  })
})

describe('pokemon type subclass', () => {
  const charmander = new FirePokemon("Charizard", 100, 20)
  const squirtle = new WaterPokemon("Squirtle", 100, 20)
  const bulbasaur = new GrassPokemon("Bulbasaur", 100, 20)
  const rattata = new NormalPokemon("Rattta", 100, 20)

  it("it should return the correct effectiveness against other types", () => {
    expect(charmander.isWeakTo(squirtle)).toBe(true)
    expect(charmander.isWeakTo(bulbasaur)).toBe(false)
    expect(charmander.isEffectiveAgainst(bulbasaur)).toBe(true)
    expect(charmander.isEffectiveAgainst(squirtle)).toBe(false)

    expect(squirtle.isWeakTo(bulbasaur)).toBe(true)
    expect(squirtle.isWeakTo(charmander)).toBe(false)
    expect(squirtle.isEffectiveAgainst(bulbasaur)).toBe(false)
    expect(squirtle.isEffectiveAgainst(charmander)).toBe(true)

    expect(bulbasaur.isWeakTo(charmander)).toBe(true)
    expect(bulbasaur.isWeakTo(squirtle)).toBe(false)
    expect(bulbasaur.isEffectiveAgainst(squirtle)).toBe(true)
    expect(bulbasaur.isEffectiveAgainst(charmander)).toBe(false)

    expect(rattata.isWeakTo(charmander)).toBe(false)
    expect(rattata.isWeakTo(squirtle)).toBe(false)
    expect(rattata.isWeakTo(bulbasaur)).toBe(false)

    expect(rattata.isEffectiveAgainst(bulbasaur)).toBe(false)
    expect(rattata.isEffectiveAgainst(squirtle)).toBe(false)
    expect(rattata.isEffectiveAgainst(charmander)).toBe(false)
  })
})

describe("Pokeball properties and methods", () => {
    const ball = new Pokeball()
    const bulbasaur = new GrassPokemon("Bulbasaur", 100, 20, "vine whip")
    const rattata = new NormalPokemon("Rattta", 100, 20)
    test("Check the property is instantiated", () => {
        expect(ball.pokemon).toBeNull()
    })
    describe("Check the pokeball methods", () => {
        test("throw method", () => {
            const logSpy = jest.spyOn(console, 'log')
            ball.throw(bulbasaur)
            expect(ball.pokemon).toBe(bulbasaur)
            expect(ball.throw()).toBe(bulbasaur)
            expect(logSpy).toHaveBeenCalledTimes(2)
        })
        test("isEmpty method", () => {
            const ball = new Pokeball()
            expect(ball.isEmpty()).toBe(true)
            ball.throw(rattata)
            expect(ball.isEmpty()).toBe(false)
        })
        test("contains method", () => {
            const ball = new Pokeball()
            expect(ball.contains()).toBe('empty...')
            ball.throw(rattata)
            expect(ball.contains()).toBe(rattata.name)
        })
    })
})

describe("Tests for Trainer class", () => {
    const trainer = new Trainer("Josh")
    // const ball = new Pokeball()
    test("Trainer properties properly instantiated", () => {
        expect(typeof trainer.belt).toBe("object")
        expect(trainer.emptyBalls).toBe(6)
    })

    describe("Trainer methods", () => {
        const rattata = new NormalPokemon("Rattata", 100, 20)
        test("catch method places pokemon in the belt", () => {
            const logSpy = jest.spyOn(console, 'log')
            trainer.catch(rattata)
            expect(logSpy).toHaveBeenCalled()
            expect(trainer.belt.size).toBe(1)
        })

        test("getPokemon retrieves and throws the chosen pokemon", () => {
            expect(trainer.getPokemon('Rattata')).toBe(rattata)
            const logSpy = jest.spyOn(console, 'log')
            expect(trainer.getPokemon('Charmander')).toBe(undefined)
            expect(logSpy).toHaveBeenCalled()
        })
    })
})

describe('Tests for Battle class', () => {
  it('should instanstiate battle class', () => {
    const trainer = new Trainer("Krasen")
    const trainer2 = new Trainer("Josh")
    const charmander = new FirePokemon("Charmander", 100, 20)
    const squirtle = new WaterPokemon("Squirtle", 100, 20)
    trainer.catch(charmander)
    trainer2.catch(squirtle)

    const battle = new Battle(trainer, trainer2, "Charmander", "Squirtle")
    expect(typeof battle).toBe("object")
    expect(battle instanceof Battle).toBe(true)
  })

  it('should fight the two pokemons', () => {
    const trainer = new Trainer("Krasen")
    const trainer2 = new Trainer("Josh")
    const charmander = new FirePokemon("Charmander", 1, 20)
    const squirtle = new WaterPokemon("Squirtle", 1, 20)
    trainer.catch(charmander)
    trainer2.catch(squirtle)

    const battle = new Battle(trainer, trainer2, "Charmander", "Squirtle")
    expect(battle.fight('tackle')).toBe("Krasen has won the battle!")
  })

  it('should have normal damage with 2 normal type pokemons', () => {
    const trainer = new Trainer("Krasen")
    const trainer2 = new Trainer("Josh")
    const rattata = new NormalPokemon("Rattata", 1, 20)
    const pidget = new NormalPokemon("Pidget", 1, 20)
    trainer.catch(rattata)
    trainer2.catch(pidget)
    const battle = new Battle(trainer, trainer2, "Rattata", "Pidget")

    expect(battle.fight('tackle')).toBe("Krasen has won the battle!")
  })
})

//      FAILED USER INPUT TESTS - NEED TO MOCK USER CHOICE INSIDE OF A FUNCTION
//
// describe("Tests for the actual game playing file", () => {
//   const mockInput = jest.fn();
//   jest.mock('@inquirer/prompts', () => () => mockInput);
//   const {input} = require('@inquirer/prompts')
//   test("Check that input has been called", async () => {
//     const spy = jest.spyOn(Trainer, 'constructor');
//     const trainer = createTrainers(1)
//     mockInput.mockReturnValue('MOCK')

//     console.log(mockInput)
//     expect(typeof trainer).toBe('object')
//     expect(spy).toHaveBeenCalled()
//   })
// })
