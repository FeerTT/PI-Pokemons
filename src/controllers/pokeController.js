const axios = require("axios");
const { Pokemon, Type } = require("../db");
const { Op } = require ("sequelize")



async function getAllPokemons() {
  const totalPokemon = [];

  const respuestaApi = await axios.get("http://pokeapi.co/api/v2/pokemon?offset=0&limit=60");
  const listaPokemon = respuestaApi.data.results;

  const pokePromesa = await Promise.all(
    listaPokemon.map(async (pokemon) => {
      const infoPokemon = await axios.get(pokemon.url);
      totalPokemon.push({
        id: infoPokemon.data.id,
        name: infoPokemon.data.name,
        image: infoPokemon.data.sprites.other.dream_world.front_default,
        life: infoPokemon.data.stats[0].base_stat,
        attack: infoPokemon.data.stats[1].base_stat,
        defense: infoPokemon.data.stats[2].base_stat,
        speed: infoPokemon.data.stats[5].base_stat,
        height: infoPokemon.data.height,
        weight: infoPokemon.data.weight,
        types: infoPokemon.data.types.map((e) => e.type.name),
        source:"api"
      });
    })
  );
  const pokeDB = await getPokemonsDB();

  const {id,nombre, imagen, vida, ataque, defensa, velocidad, altura, peso, types, source} = pokeDB
  const pokeDB2 = pokeDB.map(pokemon => {
    const {id,nombre, imagen, vida, ataque, defensa, velocidad, altura, peso, types, source} = pokemon;
    const obj={
      id,
      name:nombre,
      image:imagen,
      life:vida,
      attack:ataque,
      defense:defensa,
      speed:velocidad,
      height:peso,
      weight:altura,
      types,
      source,
    }
    return obj;
  });
  
  
  return [...totalPokemon,...pokeDB2];
}


async function getPokemonsDB(){
  const pokeAux= await Pokemon.findAll({include: Type,})

  if (pokeAux){
    return pokeAux.map((pok)=>{
      const tipos = pok.Types.map(tipo=>tipo.nombre).join(',');

      return{
        ...pok.toJSON(),
        types:tipos,
        source:"db"
      }
    })
  };
}



//////////////CONTROLADOR PARA TRAER POKEMONES POR ID
async function getPokemonByID(id) {

  const respuestaApi = await axios.get(`http://pokeapi.co/api/v2/pokemon/${id}`);
  const listaPokemon = respuestaApi.data;

  if(listaPokemon){
  const pokemonID = {
    id: listaPokemon.id,
    name: listaPokemon.name,
    image: listaPokemon.sprites.other.dream_world.front_default,
    life: listaPokemon.stats[0].base_stat,
    attack: listaPokemon.stats[1].base_stat,
    defense: listaPokemon.stats[2].base_stat,
    speed: listaPokemon.stats[5].base_stat,
    height: listaPokemon.height,
    weight: listaPokemon.weight,
    types: listaPokemon.types.map((e) => e.type.name),
  };
  return pokemonID;
  }else{
    const pokeDB = await Pokemon.findOne({
      where: {
        id,
      },
      include: Type,
    })
    if (pokeDB){
      return pokeDB;
    }else{
      throw error("No se encontró el pokemon en la base de datos.")
    }
  }
};

//////////////CONTROLADOR PARA TRAER POKEMONES POR NOMBRE
async function getPokemonByName(name){
  
  const pokeDB2 = await Pokemon.findOne({
    where: {
      nombre: {[Op.iLike]: `%${name}%`}
    },
    include: Type,
  });

  const pokemonDB = pokeDB2;

  if (pokemonDB) {
    const { id, nombre, imagen, vida, ataque, defensa, velocidad, altura, peso, Types, source } = pokemonDB;
    const tipos = Types.map((e)=>{return e.dataValues.nombre})
    const pokemonNombre = {
      id,
      name: nombre,
      image: imagen,
      life: vida,
      attack: ataque,
      defense: defensa,
      speed: velocidad,
      height: altura,
      weight: peso,
      types:tipos,
      source,
    };
    return pokemonNombre;
    }else{
      const respuestaApi = await axios.get(`http://pokeapi.co/api/v2/pokemon/${name}`);
      const listaPokemon = respuestaApi.data;
  
      if (listaPokemon){
      const pokemonNombre = {
      id: listaPokemon.id,
      name: listaPokemon.name,
      image: listaPokemon.sprites.other.dream_world.front_default,
      life: listaPokemon.stats[0].base_stat,
      attack: listaPokemon.stats[1].base_stat,
      defense: listaPokemon.stats[2].base_stat,
      speed: listaPokemon.stats[5].base_stat,
      height: listaPokemon.height,
      weight: listaPokemon.weight,
      types: listaPokemon.types.map((e) => e.type.name),
    };

    return pokemonNombre;
    };
  }

}



module.exports = {
  getAllPokemons,
  getPokemonByID,
  getPokemonByName,
};


