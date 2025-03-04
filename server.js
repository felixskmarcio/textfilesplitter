const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

// Log de inicialização do servidor para depuração
console.log('Iniciando servidor...');
console.log('Diretório atual:', __dirname);

// Verificar se o diretório dist existe
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log('Diretório dist encontrado em:', distPath);
} else {
  console.log('AVISO: Diretório dist não encontrado em:', distPath);
  console.log('Tentando criar diretório dist...');
  try {
    fs.mkdirSync(distPath, { recursive: true });
    console.log('Diretório dist criado com sucesso');
  } catch (err) {
    console.error('Erro ao criar diretório dist:', err);
  }
}

// Verificar e remover o index.html padrão se existir
const defaultIndexPath = path.join(__dirname, 'index.html');
if (fs.existsSync(defaultIndexPath)) {
  try {
    console.log('Removendo index.html padrão...');
    fs.renameSync(defaultIndexPath, path.join(__dirname, 'index.html.bak'));
    console.log('index.html padrão renomeado para index.html.bak');
  } catch (err) {
    console.error('Erro ao renomear index.html padrão:', err);
  }
}

// Servir arquivos estáticos do diretório de build da aplicação React
app.use(express.static(distPath));

// Adicionar uma rota de teste para verificar se o servidor está funcionando
app.get('/api/teste', (req, res) => {
  res.json({ mensagem: 'Servidor está funcionando corretamente' });
});

// Criar um index.html temporário se não existir
app.get('/', (req, res, next) => {
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    const tempHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Divisor Universal de Arquivos</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #20a53a; }
      </style>
    </head>
    <body>
      <h1>Divisor Universal de Arquivos</h1>
      <p>O servidor está funcionando, mas a aplicação ainda não foi construída.</p>
      <p>Por favor, execute <code>npm run build</code> para gerar os arquivos da aplicação.</p>
    </body>
    </html>
    `;
    return res.send(tempHtml);
  }
  next();
});

// Tratar quaisquer requisições que não correspondam às rotas acima
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html não encontrado. Certifique-se de construir sua aplicação React primeiro.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse sua aplicação em http://localhost:${PORT}`);
});