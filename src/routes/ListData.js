const express = require('express');
const router = express.Router();
const database = require('../configs/database.js');

// Rota para listar os resultados
router.get('/list', async (req, res) => {
    try {
        const sql = `SELECT id, DATA, scheduled, status FROM results ORDER BY id DESC`;
        const results = await database.query(sql);
        const cleanedResults = cleanResults(results);
        res.json(cleanedResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Função para limpar os resultados
function cleanResults(results) {
    return results.map(row => {
        const jsonData = JSON.parse(row.DATA);
        // Return all fields, assigning null if they don't exist
        return {
            id: row.id,
            serverid: jsonData?.server?.id || null,
            serverhost: jsonData?.server?.host || null,
            download: jsonData?.download?.bandwidth || null,
            upload: jsonData?.upload?.bandwidth || null,
            ping: jsonData?.ping?.latency || null,
            status: row.status,
            timestamp: jsonData?.timestamp || null,
            ipaddress: jsonData?.interface?.internalIp || null,
            packetloss: jsonData?.packetLoss || null,
            scheduled: row.scheduled,
        };
    });
}

module.exports = router;
