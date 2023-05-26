const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pokemones = require('./pokemons.js');
const tipos = require('./types.js');
const newPokemon = require('./pokemons.js')

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
 router.use('/pokemons', pokemones);
 router.use('/types', tipos);
 router.use('/pokemonbyname', pokemones);

module.exports = router;
