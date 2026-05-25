# Estágio 1: Build (Usando slim com suporte a glibc)
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Execução
FROM node:20-slim
WORKDIR /app

# Copia os arquivos necessários do estágio de build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# A MÁGICA AQUI: Entra direto na pasta onde o wrangler.json e o servidor foram gerados
WORKDIR /app/dist/server

# Expõe a porta do k3s
EXPOSE 3000

# Executa o Wrangler de dentro da pasta correta aceitando conexões externas
CMD ["npx", "wrangler", "dev", "--ip", "0.0.0.0", "--port", "3000"]