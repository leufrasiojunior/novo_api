const express = require('express');
const router = express.Router();
const database = require('../configs/database.js'); // supondo que você tenha um módulo para lidar com o banco de dados
const {writeToLog} = require('../configs/database.js');


router.get('/fulldata', async (req, res) => {
    try {
        const sql = `SELECT DATA FROM results` ;
        const result = await database.query(sql);
        const data = result.map(row => {return JSON.parse(row.DATA)});
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
