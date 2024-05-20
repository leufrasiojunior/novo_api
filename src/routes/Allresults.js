const express = require('express');
const router = express.Router();
const database = require('../configs/database.js');



router.get('/allresults', async (req, res) => {
    try {
        const sql = `SELECT * FROM results ORDER BY id DESC;`; ;
        const result = await database.query(sql);
        const results = result.map(result => {
            const formattedRow = {};
            for (const [key, value] of Object.entries(result)) {
                
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