# Frontend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando padrão (será sobrescrito pelo docker-compose)
CMD ["npm", "run", "dev"]
