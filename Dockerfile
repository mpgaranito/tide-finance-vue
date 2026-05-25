# Estágio 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor Nginx
FROM nginx:alpine

# 1. Limpa absolutamente tudo o que tem na pasta padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# 2. Copia os arquivos (Forçamos o chmod aqui para garantir que o Nginx consiga ler)
COPY --from=build /app/dist /usr/share/nginx/html

# 3. Garante permissão total de leitura para o Nginx nos arquivos copiados
RUN chmod -R 755 /usr/share/nginx/html

# 4. Configuração de roteamento do Nginx
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]