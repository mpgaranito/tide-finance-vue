FROM node:20-alpine
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./
RUN npm install

# Copia o resto do código
COPY . .

# Roda o build do TanStack Start
RUN npm run build

# Configura as variáveis de ambiente para o servidor aceitar conexões externas
ENV HOST=0.0.0.0
ENV PORT=3000

# Expõe a porta padrão do servidor TanStack Start / Vinxi
EXPOSE 3000

# Inicia o servidor em modo de produção
CMD ["npm", "run", "start"]