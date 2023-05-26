const { Router } = require("express");
const { Type } = require("../db.js")
const {GetTypes, saveTypesToDB} = require("../controllers/typeController.js")

const router = Router();

router.get('/',async (req,res)=>{
  try {
        const totalTipos = await GetTypes();
        const tiposDataBase= await saveTypesToDB();
        res.status(200).json(totalTipos)
      }catch (error) {
      res.status(500).json({error: 'no se pudieron obtener los tipos'})
  }
});

module.exports = router;