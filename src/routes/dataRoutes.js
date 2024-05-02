const express = require('express');
const router = express.Router();
const database = require('../configs/database'); // supondo que você tenha um módulo para lidar com o banco de dados
const {writeToLog} = require('../configs/database.js');


router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await database.query(`SELECT DATA FROM results WHERE id = ${id}`);
        if (result.length > 0) {
          // Parseando a string JSON para um objeto JavaScript
          const data = JSON.parse(result[0].DATA);
          res.send(data);
        } else {
          res.status(404).send('Nenhum resultado encontrado');
          writeToLog('Nenhum resultado encontrado')
        }
      } catch (error) {
        console.error('Erro:', error);
        res.status(500).send('Erro interno do servidor');
      }
    });

module.exports = router;
