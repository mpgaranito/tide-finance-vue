# Estágio 1: Build do Monorepo
FROM node:20-alpine AS build
WORKDIR /app

# 1. Copia os arquivos de configuração globais
COPY package*.json ./
COPY . .

# 2. Instala as dependências na raiz E dentro do client
RUN npm install
RUN cd client && npm install

# 3. Roda o build do Frontend (tentando pelo gerenciador do monorepo)
RUN cd client && npm run build

# Estágio 2: Servidor Nginx
FROM nginx:alpine

# Limpa a pasta padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia EXCLUSIVAMENTE o conteúdo compilado do Vite
# (Se o Vite salvou em client/dist, ele vai achar. Se salvou na raiz/dist, também)
COPY --from=build /app/client/dist/ /usr/share/nginx/html/

# Ajusta permissões
RUN chmod -R 755 /usr/share/nginx/html

# Configuração para Single Page Application (SPA)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]