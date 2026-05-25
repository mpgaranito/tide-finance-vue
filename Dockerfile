# Estágio 1: Build do Frontend (Client)
FROM node:20-alpine AS build
WORKDIR /app

# Copia todos os arquivos do repositório para o container
COPY . .

# ENTRA NA PASTA CLIENT (Onde o React/Vite realmente está)
WORKDIR /app/client

# Instala as dependências do frontend e gera a pasta dist correta
RUN npm install
RUN npm run build

# Estágio 2: Servidor Nginx para servir o Frontend
FROM nginx:alpine

# Limpa a pasta padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados pelo Vite de dentro de client/dist
COPY --from=build /app/client/dist /usr/share/nginx/html

# Ajusta permissões de leitura
RUN chmod -R 755 /usr/share/nginx/html

# Configuração para Single Page Application (SPA)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]