const express = require('express');
const router = express.Router();
const database = require('../configs/database.js');

router.get('/data', async (req, res) => {
    try {
        let { inicio, fim, limit } = req.query;

        if (!inicio) {
            return res.status(400).json({ error: 'Parâmetro de início é obrigatório' });
        }

        inicio = new Date(inicio);
        inicio.setHours(0, 0, 0, 0);
        inicio = inicio.toISOString();

        if (fim) {
            fim = new Date(fim);
            fim.setHours(23, 59, 59, 999);
            fim = fim.toISOString();
        }

        let sql = `SELECT id, data FROM results ORDER BY id DESC`;

        if (limit) {
            limit = parseInt(limit);
            if (isNaN(limit) || limit <= 0) {
                return res.status(400).json({ error: 'Parâmetro limit inválido' });
            }
            
        }

        const results = await database.query(sql);

        const responseData = results.map(row => {
            const jsonData = JSON.parse(row.data);
            if (jsonData) {
                const { download, upload, ping } = jsonData;
                if (download && upload && ping) {
                    const jsonDataTime = new Date(jsonData.timestamp).getTime();
                    const inicioTime = new Date(inicio).getTime();
                    const fimTime = fim ? new Date(fim).getTime() : Infinity;
                    if (jsonDataTime >= inicioTime && jsonDataTime <= fimTime) {
                        return {
                            id: row.id,
                            download: download.bandwidth ? download.bandwidth : null,
                            upload: upload.bandwidth ? upload.bandwidth : null,
                            ping: ping.jitter ? ping.jitter : null,
                            created_at: jsonData.timestamp
                        };
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        });

        const filteredData = responseData.filter(data => data !== null);
        if (filteredData.length > 0) {
            res.json(filteredData);
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
