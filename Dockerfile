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

# Expõe a porta padrão
EXPOSE 3000

# COMANDO ATUALIZADO: Ignora o package.json e chama o Vinxi direto
CMD ["npx", "vinxi", "start"]