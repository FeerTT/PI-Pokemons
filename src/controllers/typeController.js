const axios = require("axios");
const { Type } = require("../db");
const { Sequelize } = require('sequelize');


async function GetTypes(){
    const response = await axios.get('http://pokeapi.co/api/v2/type')
    const tipos = response.data.results.map((t) => t.name);
    return tipos;
}


async function saveTypesToDB() {
    try {
      const tiposExistentes = await Type.findAll();
      const tipos = await GetTypes();
  
      for (const tipo of tipos) {
        await Type.findOrCreate({ where: { nombre: tipo } });
      }
  
      const todosLosTipos = await Type.findAll();
  
      console.log('Tipos guardados en la base de datos.');
  
      return todosLosTipos;
    } catch (error) {
      console.error('Error al guardar los tipos en la base de datos:', error);
      throw error;
    }
  }
// async function saveTypesToDB() {
//     try {
//        const tiposExistentes = await Type.findAll();
//        if (tiposExistentes.length === 0){
//         const tipos = await GetTypes();
//         for (const tipo of tipos) {
//         await Type.findOrCreate({ where: { nombre: tipo } });
//        }
//        console.log('Tipos guardados en la base de datos.');
//     } else {
//         console.log('Los tipos ya existen en la base de datos.');
//     }} catch (error) {
//         console.error('Error al guardar los tipos en la base de datos:', error);
//         throw error;
//     }
// }

module.exports={
    GetTypes,
    saveTypesToDB,
}