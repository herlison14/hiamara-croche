#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║         🚀 UPLOAD SIMPLIFICADO - HIAMARA CROCHÊ                ║
╚════════════════════════════════════════════════════════════════╝
`);

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAGUZ8hI_t0HWW3hJ8k7mN9pQ0rS1tU2vW',
  projectId: 'gen-lang-client-0592600232'
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
          reject({ status: res.statusCode, body });
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function uploadProduto(produto) {
  try {
    const docData = {
      fields: {
        nome: { stringValue: produto.nome },
        slug: { stringValue: produto.slug },
        categoria: { stringValue: produto.categoria },
        preco: { doubleValue: parseFloat(produto.preco) },
        descricao: { stringValue: produto.descricao },
        ativo: { booleanValue: true },
        fotos: {
          arrayValue: {
            values: (produto.fotos || []).map(foto => ({
              mapValue: {
                fields: {
                  url: { stringValue: foto.url || '' },
                  alt: { stringValue: foto.alt || produto.nome }
                }
              }
            }))
          }
        },
        criado_em: { timestampValue: new Date().toISOString() }
      }
    };

    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/produtos`
    );
    url.searchParams.set('key', FIREBASE_CONFIG.apiKey);

    const options = {
      hostname: 'firestore.googleapis.com',
      path: url.pathname + url.search,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    console.log(`⏳ ${produto.nome}...`);
    await httpsRequest(options, docData);
    console.log(`   ✅`);
    return true;
  } catch (error) {
    console.log(`   ❌ ${error.status || 'Erro'}`);
    return false;
  }
}

async function uploadTodos() {
  try {
    console.log(`\n📦 Upload de ${catalogo.length} produtos\n`);

    let sucessos = 0;
    for (const produto of catalogo) {
      const resultado = await uploadProduto(produto);
      if (resultado) sucessos++;
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ ${sucessos}/${catalogo.length} produtos criados!`);
    console.log(`${'═'.repeat(60)}\n`);

    if (sucessos > 0) {
      console.log(`🎉 Verifique em: https://console.firebase.google.com/`);
      console.log(`🌐 Acesse: http://localhost:3000\n`);
    }

    process.exit(sucessos > 0 ? 0 : 1);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

uploadTodos();
