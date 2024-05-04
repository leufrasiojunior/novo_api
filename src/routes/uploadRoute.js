const express = require('express');
const router = express.Router();
const database = require('../configs/database.js'); // supondo que você tenha um módulo para lidar com o banco de dados
const {writeToLog} = require('../configs/database.js');


router.get('/uploads', async (req, res) => {
    try {
        const sql = `SELECT upload FROM results WHERE DATE(created_at) = DATE(UTC_TIMESTAMP())`;
        const result = await database.query(sql);
        const uploads = result.map(row => Number(row.upload));
        res.json(uploads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

module.exports = router;
