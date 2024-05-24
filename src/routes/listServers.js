const express = require('express');
const router = express.Router();
const database = require('../configs/database.js');

// Rota para listar os resultados
router.get('/listservers', async (req, res) => {
    const { dataInicio, dataFim } = req.query;

    // Verifica se as datas foram fornecidas
    if (!dataInicio || !dataFim) {
        return res.status(400).json({ error: 'Parâmetros dataInicio e dataFim são obrigatórios' });
    }

    try {
        const sql = `SELECT id, DATA, scheduled, status FROM results ORDER BY id DESC`;
        const results = await database.query(sql);

        // Configura as datas para incluir o intervalo completo de tempo
        const inicio = new Date(dataInicio);
        inicio.setHours(0, 0, 0, 0);
        const fim = new Date(dataFim);
        fim.setHours(23, 59, 59, 999);

        // Filtra os resultados no lado da aplicação
        const filteredResults = results.filter(row => {
            if (row.DATA) {
                try {
                    const jsonData = JSON.parse(row.DATA);
                    const timestamp = new Date(jsonData.timestamp);
                    return timestamp >= inicio && timestamp <= fim;
                } catch (e) {
                    console.error(`Erro ao analisar JSON para a linha com id ${row.id}:`, e);
                    return false;
                }
            }
            return false;
        });

        const cleanedResults = cleanResults(filteredResults);
        res.json(cleanedResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Função para limpar os resultados
function cleanResults(results) {
    return results.map(row => {
        try {
            const jsonData = JSON.parse(row.DATA);
            return {
                id: row.id,
                serverhost: jsonData?.server?.host || null,
                timestamp: jsonData?.timestamp || null
            };
        } catch (e) {
            console.error(`Erro ao analisar JSON para a linha com id ${row.id}:`, e);
            return {
                serverhost: null,
                timestamp: null
            };
        }
    });
}

module.exports = router;
