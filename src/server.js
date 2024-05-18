const express = require('express');
const app = express();
const cors = require('cors');
const dataRoutes = require('./routes/dataRoutes.js');
const chartRoute = require('./routes/chartRoute.js');
const {writeToLog} = require('./configs/database.js');
const morgan = require('morgan');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const compression = require('compression'); // Importar o módulo de compressão


app.use(cors({
  origin: '*',
  methods: 'GET',
  optionsSuccessStatus: 200
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
app.use('/', chartRoute);



app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
