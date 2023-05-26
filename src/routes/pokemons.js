const { Router } = require("express");
const {getAllPokemons, getPokemonByID, getPokemonByName,} = require("../controllers/pokeController.js")
const {Pokemon, Type} = require("../db.js")
const { Sequelize } = require('sequelize');

const router = Router();

router.get('/', async (req, res) =>{
    try {
        const pokemones = await getAllPokemons();
        res.status(200).json(pokemones);
    } catch (error) {
        res.status(500).json("error al traer los pokemones")
    }
})

router.get('/name', async (req,res)=>{
    const { name } = req.query;

    try {
        const pokeNombre = await getPokemonByName(name);
        if (pokeNombre){
            res.status(200).json(pokeNombre)
        }else{
            res.status(404).json({ error: 'No se encontró ningún Pokémon con el nombre indicado.' })
        }
    } catch (error) {
        res.status(500).json({error: 'El Nombre o el ID indicado es inexistente.'})
    }
})

router.get('/:id', async (req,res)=>{
    const { id } = req.params;
    try {
        const pokemon = await getPokemonByID(id);
        if (pokemon){
            res.status(200).json(pokemon);
        }else{
            res.status(404).json({ error:'No se encontró ningún Pokémon con el ID indicado.' })
        }
    } catch (error) {
        
        res.status(500).json({error: 'El nombre o el ID indicado es inexistente.'})
    }
})



router.post('/', async (req, res, next) => {
    const {nombre, imagen, vida, ataque, defensa, velocidad, altura, peso, types} = req.body;
    if (!nombre || !imagen || !vida || !ataque || !defensa) {
        //este error debería estar en el front
        return res.status(404).json({error : 'No se puede crear un pokemon sin estos datos: *nombre, *imagen, *vida, *ataque, *defensa'});
        
    }

    const pokemonsDB = await Pokemon.findOne({where: {nombre:nombre}})

    if (pokemonsDB){
        return res.status(500).json({error: 'Ya existe un pokemon con ese nombre en la Base de datos.'})
    }
    try {

        const newPokemon = await Pokemon.create({
            nombre: nombre,
            imagen: imagen,
            vida: vida,
            ataque: ataque,
            defensa: defensa,
            velocidad: velocidad,
            altura: altura,
            peso: peso,
            
        });
        //tipes es un array? no?  hago de types un array [types]
        const tiposArray = Array.isArray(types) ? types : [types];
        for (let typeName of tiposArray){
            let tipo = await Type.findOne({where: {nombre: typeName}});
        if (!tipo){
            tipo=await Type.create({nombre: typeName});
        }
        await newPokemon.addType(tipo)
        }
        const resultPokemon = await Pokemon.findOne({
            where: { nombre: nombre },
            include: [{
            model: Type,
            attributes: ['id', 'nombre']
            }]
        });

        return res.status(201).json(resultPokemon);
}
catch (error) {
    res.status(500).json({error: 'error al crear el pokemon'})
}
});



module.exports = router;