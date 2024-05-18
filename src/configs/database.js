const mysql = require('mysql');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Configuração da conexão com o banco de dados
let connection;

function createConnection() {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Conecta ao banco de dados
  connection.connect((err) => {
    if (err) {
      handleConnectionError(err);
      return;
    }
    console.log('Conexão ao banco de dados estabelecida');
    writeToLog("Conexão ao banco de dados estabelecida");
  });

  // Define o tratamento de erro de conexão
  connection.on('error', (err) => {
    handleConnectionError(err);
  });
}

function handleConnectionError(err) {
  if (err) {
    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      const errorMessage = { error: 500, message: err.sqlMessage };
      console.error(errorMessage)
      writeToLog(JSON.stringify(errorMessage));
    } else if (err.code === "ECONNREFUSED") {
      const errorMessage = { error: 500, message: err};
      console.error(errorMessage)
      writeToLog(JSON.stringify(errorMessage));
      createConnection();
    } 
    else if (err.code ==="ER_DBACCESS_DENIED_ERROR"){
      const errorMessage = { error: 500, message: "Database name error. Check name" };
      console.error(errorMessage)
      writeToLog(JSON.stringify(errorMessage));
    }else {
      const errorMessage = { error: 500, message: "Internal Server Error. Check configs" };
      console.error(errorMessage)
      writeToLog(JSON.stringify(errorMessage));
    }
    // Recria a conexão após 10 minutos
    setTimeout(createConnection, 10 * 60 * 1000); // 10 minutos em milissegundos
  }
}

// Função para fazer consultas ao banco de dados
function query(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, (error, results, fields) => {
      if (error) {
        console.error('Erro de banco de dados:', error);
        writeToLog(error);
        if (error.code === 'ECONNREFUSED') {
          const errorMessage = { error: 500, message: error.sqlMessage };
          reject(errorMessage);
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
          const errorMessage = { error: 400, message: error.sqlMessage };
          reject(errorMessage);
        } else {
          reject(error);
        }
        return;
      }
      resolve(results);
    });
  });
}

// Função para escrever no arquivo de log
function writeToLog(data) {
  const logMessage = `[${new Date().toISOString()}] ${data}\n`;
  console.log( `[${new Date().toISOString()}] ${data}\n`)
  fs.appendFile('log.log', logMessage, (err) => {
    if (err) console.error('Erro ao escrever no arquivo de log:', err);
  });
}

// Inicialmente cria a conexão
createConnection();

module.exports = { query, writeToLog };
