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
        if (!jsonData) return null;
        const { timestamp, ping, download, server, upload, interface } = jsonData;
        if (!timestamp || !ping || !download || !server || !upload || !interface) return null;
        return {
            id: row.id,
            serverid: server.id,
            serverhost: server.host,
            download: download.bandwidth,
            upload: upload.bandwidth,
            ping: ping.latency,
            status: row.status,
            timestamp: timestamp,
            ipaddress: interface.internalIp,
            packetloss: jsonData.packetLoss,
            scheduled: row.scheduled,
        };
    }).filter(result => result !== null); // Remover resultados nulos
}

module.exports = router;
