const express = require('express');
const router = express.Router();
const database = require('../configs/database.js'); // supondo que você tenha um módulo para lidar com o banco de dados
const {writeToLog} = require('../configs/database.js');

/**
 * @swagger
 * tags:
 *   name: Downloads
 *   description: API para gerenciamento de downloads
 */

/**
 * @swagger
 * /downloads:
 *   get:
 *     summary: Retorna todos os downloads realizados hoje
 *     tags: [Downloads]
 *     responses:
 *       200:
 *         description: Sucesso ao obter os downloads
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     description: Data do download
 *                   download:
 *                     type: number
 *                     description: Quantidade de downloads realizados
 *       500:
 *         description: Erro interno do servidor
 */

router.get('/downloads', async (req, res) => {
    try {
        const sql = `SELECT DATE(created_at) AS date, download FROM results WHERE DATE(created_at) = DATE(UTC_TIMESTAMP())`;
        const result = await database.query(sql);
        const downloads = result.map(row => ({ date: row.date.toISOString(), download: Number(row.download) }));
        res.json(downloads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });

module.exports = router;
