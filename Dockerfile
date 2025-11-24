FROM node:18

WORKDIR /app

# Copiar package.json primeiro (otimiza cache)
COPY package*.json ./
RUN npm ci

# Copiar o resto do código
COPY . .

# Copiar e configurar Prisma
COPY prisma ./prisma/
RUN npx prisma generate

# Expor porta
EXPOSE 3000

# Comando para produção
CMD ["npm", "start"]