const express = require('express');
const router = express.Router();
const database = require('../configs/database.js'); // supondo que você tenha um módulo para lidar com o banco de dados
const {writeToLog} = require('../configs/database.js');


router.get('/list', async (req, res) => {
    try {
        const pageSize = parseInt(req.query.pageSize) || 10;
        const countRows = await database.query(`SELECT COUNT(*) as totalRows FROM results `);
        const totalRows = Number(countRows[0].totalRows);
        const totalPages = Math.ceil(totalRows / pageSize);
        const page = parseInt(req.query.page) || 1;
        const remainingPages = totalPages - page;
        const offset = (page - 1) * pageSize;
        const sql = `SELECT id, ping, download, upload,status,scheduled, created_at, updated_at FROM results ORDER BY ID DESC LIMIT ${offset}, ${pageSize}`;
        const rows = await database.query(sql);
        const data = rows.map(row => {
            const formattedRow = {};
            for (const [key, value] of Object.entries(row)) {
                formattedRow[key] = typeof value === 'bigint' ? Number(value) : value;
            }
            return formattedRow;
        });

        res.json({
            totalRows,
            totalPages,
            remainingPages,
            data,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
