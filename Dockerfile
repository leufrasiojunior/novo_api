# Dockerfile para servidor Express

# Use a imagem base do Node.js
FROM node:14

# Diretório de trabalho dentro do contêiner
WORKDIR /usr/src/

# Copie o arquivo package.json e package-lock.json (se existirem)
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código fonte
COPY . .

# Porta em que o servidor Express irá escutar
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "src/server.js"]
