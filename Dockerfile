# Estágio 1: Build do projeto na Raiz (Onde funciona)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: O Localizador (Procura o index.html dinamicamente)
FROM alpine AS finder
COPY --from=build /app /target
RUN mkdir /html-ready && \
    TARGET_DIR=$(find /target -name "index.html" -not -path "*/node_modules/*" -exec dirname {} \; | head -n 1) && \
    if [ -n "$TARGET_DIR" ]; then \
        echo "--> Sucesso! index.html encontrado em: $TARGET_DIR" && \
        cp -r $TARGET_DIR/* /html-ready/; \
    else \
        echo "❌ ERRO: index.html não foi encontrado em lugar nenhum do build!" && exit 1; \
    fi

# Estágio 3: Servidor Nginx Final
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos que o Localizador isolou
COPY --from=finder /html-ready /usr/share/nginx/html

# Ajusta permissões de leitura
RUN chmod -R 755 /usr/share/nginx/html

# Configuração para Single Page Application (SPA)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]