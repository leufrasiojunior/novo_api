const express = require('express');
const app = express();
const dataRoutes = require('./routes/dataRoutes');
const {writeToLog} = require('./configs/database.js');
const morgan = require('morgan');


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
app.use('/data', dataRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
