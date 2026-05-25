# Estágio 1: Build da aplicação React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor Nginx para rodar o Frontend
FROM nginx:alpine

# LINHA NOVA: Deleta a página padrão do Nginx antes de copiar o seu app
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados pelo Vite
COPY --from=build /app/dist /usr/share/nginx/html

RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
