FROM node:20-alpine
WORKDIR /app

# Instala as dependências globais
COPY package*.json ./
RUN npm install

# Copia o resto do código
COPY . .

# Roda o build que gera o pacote da Cloudflare (dist/server)
RUN npm run build

# Expõe a porta que o k3s está esperando
EXPOSE 3000

# COMANDO CORRETO: Usa o wrangler para rodar o build localmente
CMD ["npx", "wrangler", "dev", "--ip", "0.0.0.0", "--port", "3000"]