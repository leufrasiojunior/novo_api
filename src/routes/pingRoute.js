const express = require('express');
const router = express.Router();
const database = require('../configs/database.js'); // supondo que você tenha um módulo para lidar com o banco de dados


router.get('/pings', async (req, res) => {
    try {
        const sql = `SELECT DATE(created_at) AS date, ping FROM results WHERE DATE(created_at) = DATE(UTC_TIMESTAMP())`;
        const result = await database.query(sql);
        const pings = result.map(row => ({ date: row.date.toISOString(), ping: Number(row.ping) }));
        res.json(pings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

module.exports = router;
