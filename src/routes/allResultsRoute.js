const express = require('express');
const router = express.Router();
const database = require('../configs/database.js'); // supondo que você tenha um módulo para lidar com o banco de dados
const {writeToLog} = require('../configs/database.js');



router.get('/allresults', async (req, res) => {
    try {
        const sql = `SELECT * FROM results;`; ;
        const result = await database.query(sql);
        const results = result.map(result => {
            const formattedRow = {};
            for (const [key, value] of Object.entries(result)) {
                // Converta somente o campo DATA para JSON
                formattedRow[key] = key === 'data' ? JSON.parse(value) : value;
            }
            return formattedRow;
        });
        res.json(results);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
