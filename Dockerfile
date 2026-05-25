# Estágio 1: Build do Frontend
FROM node:20-alpine AS build
WORKDIR /app

# Copia todo o projeto
COPY . .

# Entra na pasta do cliente e roda o build
WORKDIR /app/client
RUN npm install
RUN npm run build

# SCRIPT INTELIGENTE: Detecta onde os arquivos compilados foram parar e centraliza
RUN mkdir -p /app/html-ready && \
    if [ -d "/app/client/dist" ] && [ "$(ls -A /app/client/dist)" ]; then \
        echo "--> Detectado: client/dist" && cp -r /app/client/dist/* /app/html-ready/; \
    elif [ -d "/app/dist" ] && [ "$(ls -A /app/dist)" ]; then \
        echo "--> Detectado: raiz/dist" && cp -r /app/dist/* /app/html-ready/; \
    elif [ -d "/app/client/build" ] && [ "$(ls -A /app/client/build)" ]; then \
        echo "--> Detectado: client/build" && cp -r /app/client/build/* /app/html-ready/; \
    elif [ -d "/app/server/public" ] && [ "$(ls -A /app/server/public)" ]; then \
        echo "--> Detectado: server/public" && cp -r /app/server/public/* /app/html-ready/; \
    else \
        echo "❌ ERRO: Nenhuma pasta de build foi encontrada! Listando estrutura para diagnóstico:" && \
        echo "=== RAIZ DEL PROJETO ===" && ls -la /app && \
        echo "=== PASTA CLIENT ===" && ls -la /app/client && \
        exit 1; \
    fi

# Estágio 2: Servidor Nginx
FROM nginx:alpine

# Limpa a pasta padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos da pasta centralizada pelo script acima
COPY --from=build /app/html-ready /usr/share/nginx/html

# Ajusta permissões
RUN chmod -R 755 /usr/share/nginx/html

# Configuração para Single Page Application (SPA)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]