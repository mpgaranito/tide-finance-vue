# Estágio 1: Build e Diagnóstico
FROM node:20-alpine AS build
WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala as dependências globais
RUN npm install

# 1. IMPRIME O SCRIPT DO SEU PROJETO NO LOG
RUN echo "=== CONTEÚDO DO PACKAGE.JSON DA RAIZ ===" && cat package.json || echo "Sem package.json na raiz"
RUN echo "=== CONTEÚDO DO PACKAGE.JSON DO CLIENT ===" && cat client/package.json || echo "Sem package.json no client"

# Roda o build padrão
RUN npm run build

# 2. MAPEIA ONDE OS ARQUIVOS FORAM PARAR
RUN echo "=== MAPA DE ARQUIVOS GERADOS APÓS O BUILD ===" && \
    find . -maxdepth 4 -not -path "*/node_modules/*" -not -path "*/.git/*"

# Força o build a parar aqui para podermos ler o log no GitHub
RUN echo "❌ Pausa de diagnóstico ativada. Olhe o log acima!" && exit 1