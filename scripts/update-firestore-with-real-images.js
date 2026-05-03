#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const config = {
  projectId: 'gen-lang-client-0592600232',
  apiKey: 'AIzaSyAGUZ8hI_t0HWW3hJ8k7mN9pQ0rS1tU2vW'
};

const updates = JSON.parse(fs.readFileSync('./scripts/firestore-image-updates.json', 'utf-8'));

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

async function getProducts() {
  const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/produtos?key=${config.apiKey}`;
  const options = {
    hostname: 'firestore.googleapis.com',
    path: url.replace('https://firestore.googleapis.com', ''),
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  const response = await httpsRequest(options);
  return JSON.parse(response.body).documents || [];
}

async function updateProduct(docId, productSlug) {
  const imageData = updates[productSlug];
  if (!imageData) {
    console.log(`⚠️  Sem mapeamento para: ${productSlug}`);
    return false;
  }

  const docData = {
    fields: {
      fotos: {
        arrayValue: {
          values: [
            {
              mapValue: {
                fields: {
                  url: { stringValue: `http://localhost:3000${imageData.url}` },
                  alt: { stringValue: imageData.alt }
                }
              }
            }
          ]
        }
      }
    }
  };

  const url = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/produtos/${docId}`;
  const options = {
    hostname: 'firestore.googleapis.com',
    path: `${url.replace('https://firestore.googleapis.com', '')}?key=${config.apiKey}&updateMask.fieldPaths=fotos`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  };

  await httpsRequest(options, docData);
  return true;
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║      🖼️  ATUALIZAR FIRESTORE COM IMAGENS REAIS DE CROCHÊ       ║
╚════════════════════════════════════════════════════════════════╝
`);

  try {
    console.log('\n📦 Buscando produtos no Firestore...\n');
    const documents = await getProducts();

    console.log(`🔄 Atualizando ${documents.length} produtos com imagens reais:\n`);

    let updated = 0;
    let failed = 0;

    for (const doc of documents) {
      const docId = doc.name.split('/').pop();
      const slug = doc.fields?.slug?.stringValue;
      const nome = doc.fields?.nome?.stringValue;

      try {
        const success = await updateProduct(docId, slug);
        if (success) {
          console.log(`✅ ${nome}`);
          console.log(`   Imagem: /produtos/${updates[slug]?.url.split('/').pop()}`);
          console.log(`   ${updates[slug]?.alt}\n`);
          updated++;
        } else {
          console.log(`⚠️  ${nome} - Sem mapeamento de imagem\n`);
          failed++;
        }
      } catch (error) {
        console.log(`❌ ${nome} - ${error.message}\n`);
        failed++;
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`════════════════════════════════════════════════════════════════`);
    console.log(`✅ ${updated} produtos atualizados com imagens reais`);
    if (failed > 0) console.log(`⚠️  ${failed} produtos falharam ou sem mapeamento`);
    console.log(`════════════════════════════════════════════════════════════════\n`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main();
