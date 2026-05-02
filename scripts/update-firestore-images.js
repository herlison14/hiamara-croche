#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║    🔄 ATUALIZAR IMAGENS NO FIRESTORE                           ║
╚════════════════════════════════════════════════════════════════╝
`);

const FIREBASE_CONFIG = {
  projectId: 'gen-lang-client-0592600232',
  apiKey: 'AIzaSyAGUZ8hI_t0HWW3hJ8k7mN9pQ0rS1tU2vW'
};

const catalogoPath = './public/produtos/catalogo-preparado.json';
const catalogo = JSON.parse(fs.readFileSync(catalogoPath, 'utf-8'));

function httpsRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}`));
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

async function updateProduct(docId, produto) {
  try {
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
                  alt: { stringValue: foto.alt || produto.nome }
                }
              }
            }))
          }
        },
        criado_em: { timestampValue: new Date().toISOString() }
      }
    };

    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/produtos/${docId}`;

    const options = {
      hostname: 'firestore.googleapis.com',
      path: `${url.replace('https://firestore.googleapis.com', '')}?key=${FIREBASE_CONFIG.apiKey}&updateMask.fieldPaths=fotos&updateMask.fieldPaths=descricao`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    };

    console.log(`⏳ ${produto.nome}...`);
    await httpsRequest(options, { fields: docData.fields });
    console.log(`   ✅`);
    return true;
  } catch (error) {
    console.log(`   ❌ ${error.message}`);
    return false;
  }
}

async function fetchAndUpdate() {
  try {
    console.log(`\n📦 Buscando documentos no Firestore...\n`);

    const listUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/produtos?key=${FIREBASE_CONFIG.apiKey}`;

    const options = {
      hostname: 'firestore.googleapis.com',
      path: `${listUrl.replace('https://firestore.googleapis.com', '')}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await httpsRequest(options);
    const documents = JSON.parse(response.body).documents || [];

    console.log(`\n🔄 Atualizando ${documents.length} documentos...\n`);

    let sucessos = 0;
    let erros = 0;

    for (let i = 0; i < documents.length && i < catalogo.length; i++) {
      const doc = documents[i];
      const produto = catalogo[i];
      const docId = doc.name.split('/').pop();

      const resultado = await updateProduct(docId, produto);
      if (resultado) sucessos++;
      else erros++;

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ ${sucessos} documentos atualizados`);
    if (erros > 0) console.log(`❌ ${erros} erros`);
    console.log(`${'═'.repeat(60)}\n`);

    console.log(`🌐 Acesse: http://localhost:3000/produtos\n`);

    process.exit(sucessos > 0 ? 0 : 1);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

fetchAndUpdate();
