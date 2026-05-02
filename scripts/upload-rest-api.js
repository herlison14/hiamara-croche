#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║    🚀 UPLOAD VIA REST API - HIAMARA CROCHÊ (Sem Admin Key)      ║
╚════════════════════════════════════════════════════════════════╝
`);

// Credenciais públicas do Firebase (de .env.local)
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAGUZ8hI_t0HWW3hJ8k7mN9pQ0rS1tU2vW',
  authDomain: 'gen-lang-client-0592600232.firebaseapp.com',
  projectId: 'gen-lang-client-0592600232',
  storageBucket: 'gen-lang-client-0592600232.firebasestorage.googleapis.com',
  messagingSenderId: '156302370792',
  appId: '1:156302370792:web:a05e1a7b709674b8ac265d'
};

const catalogoPath = './public/produtos/catalogo-preparado.json';
const catalogo = JSON.parse(fs.readFileSync(catalogoPath, 'utf-8'));

// Função para fazer requisição HTTPS
function httpsRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        } else {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// Upload de produto para Firestore via REST API
async function uploadProduto(produto) {
  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/produtos`;

    // Preparar dados do produto para REST API
    const docData = {
      fields: {
        nome: { stringValue: produto.nome },
        slug: { stringValue: produto.slug },
        categoria: { stringValue: produto.categoria },
        preco: { doubleValue: produto.preco },
        descricao: { stringValue: produto.descricao },
        ativo: { booleanValue: true },
        fotos: {
          arrayValue: {
            values: produto.fotos.map(foto => ({
              mapValue: {
                fields: {
                  url: { stringValue: foto.url },
                  alt: { stringValue: foto.alt }
                }
              }
            }))
          }
        },
        criado_em: { timestampValue: new Date().toISOString() }
      }
    };

    const options = {
      hostname: 'firestore.googleapis.com',
      path: `${firestoreUrl.replace('https://firestore.googleapis.com', '')}?key=${FIREBASE_CONFIG.apiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    console.log(`\n⏳ Enviando: ${produto.nome}`);

    const response = await httpsRequest(options, docData);
    console.log(`   ✅ Produto criado com sucesso!`);
    return true;
  } catch (error) {
    console.error(`   ❌ Erro: ${error.message}`);
    return false;
  }
}

// Processar upload em série (evita rate limiting)
async function uploadTodos() {
  try {
    console.log(`\n📦 Iniciando upload de ${catalogo.length} produtos...\n`);

    let sucessos = 0;
    let erros = 0;

    for (const produto of catalogo) {
      const resultado = await uploadProduto(produto);
      if (resultado) sucessos++;
      else erros++;

      // Pequeno delay entre requisições
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`

╔════════════════════════════════════════════════════════════════╗
║                    ✅ UPLOAD COMPLETO!                        ║
╚════════════════════════════════════════════════════════════════╝

📊 Resultado:
   ✅ Produtos criados: ${sucessos}
   ❌ Erros: ${erros}
   📸 Total de fotos: ${catalogo.reduce((acc, p) => acc + p.fotos.length, 0)}

🌐 Verifique em:
   https://console.firebase.google.com/
   Projeto: gen-lang-client-0592600232
   Collection: produtos

🎉 Acesse http://localhost:3000 para ver os produtos no site!
`);

    process.exit(sucessos > 0 ? 0 : 1);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

uploadTodos();
