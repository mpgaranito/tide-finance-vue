# Estágio 1: Build (Mudamos para Node 22 Slim)
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Execução (Mudamos para Node 22 Slim)
FROM node:22-slim
WORKDIR /app

# Copia os arquivos necessários do estágio de build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Entra na pasta onde o wrangler.json e o servidor foram gerados
WORKDIR /app/dist/server

# Expõe a porta do k3s
EXPOSE 3000

# Executa o Wrangler aceitando conexões externas
CMD ["npx", "wrangler", "dev", "--ip", "0.0.0.0", "--port", "3000"]