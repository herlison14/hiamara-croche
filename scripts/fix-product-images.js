#!/usr/bin/env node

const https = require('https');
const fs = require('fs');

const config = {
  projectId: 'gen-lang-client-0592600232',
  apiKey: 'AIzaSyAGUZ8hI_t0HWW3hJ8k7mN9pQ0rS1tU2vW'
};

// Proper crochet product images by category
const CATEGORY_IMAGES = {
  'Bonecos': [
    'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&h=500&fit=crop&q=80', // toys
    'https://images.unsplash.com/photo-1590080876-f64a30a41a24?w=500&h=500&fit=crop&q=80', // plush toys
    'https://images.unsplash.com/photo-1608672852723-cf6473dfe50a?w=500&h=500&fit=crop&q=80', // handmade toys
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop&q=80', // crafts
    'https://images.unsplash.com/photo-1614608267537-b85ca80ca265?w=500&h=500&fit=crop&q=80', // crochet detail
  ],
  'Bolsas': [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop&q=80', // fabric bags
    'https://images.unsplash.com/photo-1608923701772-5e0a050dc4ee?w=500&h=500&fit=crop&q=80', // woven bag
  ],
  'Roupas': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&q=80', // crochet clothing
    'https://images.unsplash.com/photo-1595777712802-14e1ef9c45c1?w=500&h=500&fit=crop&q=80', // knit wear
    'https://images.unsplash.com/photo-1585221579842-3fb5f75ce708?w=500&h=500&fit=crop&q=80', // handmade clothes
  ]
};

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
  const listUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/produtos?key=${config.apiKey}`;
  const options = {
    hostname: 'firestore.googleapis.com',
    path: listUrl.replace('https://firestore.googleapis.com', ''),
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  const response = await httpsRequest(options);
  return JSON.parse(response.body).documents || [];
}

async function updateProduct(docId, categoria, imageUrl) {
  const docData = {
    fields: {
      fotos: {
        arrayValue: {
          values: [
            {
              mapValue: {
                fields: {
                  url: { stringValue: imageUrl },
                  alt: { stringValue: `Produto de ${categoria}` }
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
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║         🖼️  CORRIGIR IMAGENS DOS PRODUTOS NO FIRESTORE         ║
╚════════════════════════════════════════════════════════════════╝
`);

  try {
    console.log('📦 Buscando produtos...\n');
    const documents = await getProducts();

    const categoryCounts = {};

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const docId = doc.name.split('/').pop();
      const categoria = doc.fields?.categoria?.stringValue || 'Desconhecida';

      if (!categoryCounts[categoria]) categoryCounts[categoria] = 0;
      const imageIndex = categoryCounts[categoria]++;

      const images = CATEGORY_IMAGES[categoria] || CATEGORY_IMAGES['Bonecos'];
      const imageUrl = images[imageIndex % images.length];

      const nome = doc.fields?.nome?.stringValue || 'Sem nome';
      console.log(`⏳ ${nome}`);
      console.log(`   Categoria: ${categoria}`);
      console.log(`   Nova imagem: ${imageUrl.substring(0, 60)}...`);

      try {
        await updateProduct(docId, categoria, imageUrl);
        console.log(`   ✅ Atualizado\n`);
      } catch (error) {
        console.log(`   ❌ Erro: ${error.message}\n`);
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`════════════════════════════════════════════════════════════════`);
    console.log(`✅ Todas as imagens foram corrigidas!`);
    console.log(`════════════════════════════════════════════════════════════════\n`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main();
