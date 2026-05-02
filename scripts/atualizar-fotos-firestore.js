#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║    🔄 ATUALIZAR FOTOS NO FIRESTORE                             ║
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

// Primeiro, obter IDs dos documentos
async function obterDocumentos() {
  try {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/produtos`
    );
    url.searchParams.set('key', FIREBASE_CONFIG.apiKey);

    const options = {
      hostname: 'firestore.googleapis.com',
      path: url.pathname + url.search,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await httpsRequest(options);
    return response.documents || [];
  } catch (error) {
    console.error('Erro ao obter documentos:', error);
    return [];
  }
}

async function atualizarDocumento(docPath, fotos) {
  try {
    const docData = {
      fields: {
        fotos: {
          arrayValue: {
            values: fotos.map(foto => ({
              mapValue: {
                fields: {
                  url: { stringValue: foto.url },
                  alt: { stringValue: foto.alt }
                }
              }
            }))
          }
        }
      }
    };

    const url = new URL(`https://firestore.googleapis.com/v1/${docPath}`);
    url.searchParams.set('key', FIREBASE_CONFIG.apiKey);
    url.searchParams.set('updateMask.fieldPaths', 'fotos');

    const options = {
      hostname: 'firestore.googleapis.com',
      path: url.pathname + url.search,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    };

    await httpsRequest(options, docData);
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar: ${error.message}`);
    return false;
  }
}

async function executar() {
  try {
    console.log(`\n📚 Obtendo documentos do Firestore...\n`);
    const docs = await obterDocumentos();

    console.log(`\n📸 Atualizando ${docs.length} documentos com as fotos...\n`);

    let contador = 0;
    for (const doc of docs) {
      const nome = doc.fields?.nome?.stringValue || 'desconhecido';
      const docPath = doc.name;

      // Encontrar produto no catálogo pelo nome
      const produto = catalogo.find(p => p.nome === nome);
      if (produto && produto.fotos) {
        console.log(`⏳ ${nome}`);
        const sucesso = await atualizarDocumento(docPath, produto.fotos);
        if (sucesso) {
          console.log(`   ✅ Atualizado com ${produto.fotos.length} fotos`);
          contador++;
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ ${contador}/${docs.length} documentos atualizados!`);
    console.log(`${'═'.repeat(60)}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

executar();
