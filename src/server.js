const express = require('express');
const app = express();
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes.js');
const downloadRoutes = require('./routes/DownloadRoute.js');
const uploadRoutes = require('./routes/uploadRoute.js');
const pingRoutes = require('./routes/pingRoute.js');
const averagesRoutes = require('./routes/averagesRoute.js');
const allresultsRoutes = require('./routes/allResultsRoute.js');
const fulldataRoutes = require('./routes/fullDataRoute.js');
const listRoutes = require('./routes/listRoute.js');
const {writeToLog} = require('./configs/database.js');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const compression = require('compression'); // Importar o módulo de compressão


app.use(cors({
  origin: '*', // Permitir solicitações de qualquer origem
  methods: 'GET', // Permitir apenas o método GET
  optionsSuccessStatus: 200 // Retornar o status 200 para solicitações OPTIONS
}));

app.use(compression());

app.use(morgan('dev', {
  stream: {
    write: (message) => {
      // Função para remover as cores
      const cleanMessage = message.replace(/\x1b\[\d+m/g, '');
      // Envia a mensagem limpa para a função writeToLog
      writeToLog(cleanMessage.trim());
    }
  }
}));

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use('/specified', dataRoutes);
app.use('/', downloadRoutes, uploadRoutes, pingRoutes, averagesRoutes, allresultsRoutes, fulldataRoutes, listRoutes);




app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
