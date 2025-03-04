# Divisor Universal de Arquivos

> Uma ferramenta online que ajuda você a dividir qualquer tipo de arquivo em partes iguais, com processamento totalmente no navegador para máxima privacidade e segurança.

🌐 **[Acesse a ferramenta online](https://textfilesplitter.felixbr.org)**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📑 Índice

- [✨ Funcionalidades](#-funcionalidades)
- [🛠️ Tecnologias](#️-tecnologias)
- [💻 Desenvolvimento Local](#-desenvolvimento-local)
- [🚀 Opções de Implantação](#-opções-de-implantação)
  - [EasyPanel e Nixpacks](#easypanel-e-nixpacks)
  - [Docker](#docker)
- [📝 Licença](#-licença)

## ✨ Funcionalidades

🔄 **Divisão Inteligente de Arquivos**
- Divide arquivos de texto por linhas ou caracteres
- Mantém cabeçalhos em arquivos Excel (.xlsx/.xls) e CSV
- Suporta divisão de arquivos binários em partes iguais

🔒 **Privacidade e Segurança**
- Processamento 100% no navegador
- Seus arquivos nunca deixam seu dispositivo
- Sem necessidade de upload para servidores

🎯 **Experiência do Usuário**
- Interface moderna e intuitiva
- Suporte para arrastar e soltar arquivos
- Visualização em tempo real do processo

## 🛠️ Tecnologias

Este projeto é construído com tecnologias modernas e robustas:

- **React** - Biblioteca para construção de interfaces
- **TypeScript** - Adiciona tipagem estática ao JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **File-Saver** - Gerenciamento de download de arquivos
- **JSZip** - Manipulação de arquivos ZIP
- **XLSX** - Processamento de arquivos Excel

## 💻 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Visualizar build de produção
npm run preview
```

## 🚀 Opções de Implantação

### EasyPanel e Nixpacks

#### 📋 Pré-requisitos
- Conta no EasyPanel
- Repositório Git configurado

#### 📁 Arquivos de Configuração
- `nixpacks.toml` - Configuração do Nixpacks
- `Procfile` - Definição de processos
- `static.json` - Configuração de arquivos estáticos
- `.env` - Variáveis de ambiente

#### 📝 Passo a Passo
1. Verifique se todos os arquivos de configuração estão presentes
2. No EasyPanel, crie um novo serviço
3. Selecione seu repositório
4. O Nixpacks cuidará automaticamente do processo de build

#### 🔍 Solução de Problemas
- Verifique os logs de construção
- Confirme as dependências no `package.json`
- Verifique a instalação do Node.js e npm
- Confirme as variáveis de ambiente

### Docker

#### 📁 Arquivos de Configuração
- `Dockerfile` - Instruções de build
- `docker-compose.yml` - Configuração de serviços
- `nginx.conf` - Configuração do servidor web
- `.dockerignore` - Arquivos a ignorar

#### 🐳 Implantação

**Usando Docker Compose:**
```bash
docker-compose up -d
```

**Ou manualmente:**
```bash
# Construir imagem
docker build -t divisor-universal-de-arquivos .

# Executar contêiner
docker run -p 3000:80 -d divisor-universal-de-arquivos
```

Acesse em: `http://localhost:3000`

## 📝 Licença

Copyright 2025 © - FelixBR - Todos os direitos reservados
# textfilesplitter
# textfilesplitter
