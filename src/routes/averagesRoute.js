const express = require('express');
const router = express.Router();
const database = require('../configs/database.js');


router.get('/averages', async (req, res) => {
    try {
        const sql = `SELECT AVG(download) AS avg_download, AVG(upload) AS avg_upload, AVG(ping) AS avg_ping FROM results WHERE DATE(created_at) = DATE(UTC_TIMESTAMP())`;
        const result = await database.query(sql);
        const { avg_download, avg_upload, avg_ping } = result[0];

            res.json({
            averageDownload: Number(avg_download),
            averageUpload: Number(avg_upload),
            averagePing: Number(avg_ping)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

module.exports = router;
