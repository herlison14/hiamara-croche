#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║    📸 UPLOAD DE IMAGENS PARA FIREBASE STORAGE                  ║
╚════════════════════════════════════════════════════════════════╝
`);

const FIREBASE_CONFIG = {
  storageBucket: 'gen-lang-client-0592600232.appspot.com',
  apiKey: 'AIzaSyAGUZ8hI_t0HWW3hJ8k7mN9pQ0rS1tU2vW'
};

const produtosDir = './public/produtos';
const imagemFiles = fs.readdirSync(produtosDir).filter(f =>
  f.match(/\.(jpg|jpeg|png)$/i)
);

async function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const remotePath = `produtos/${fileName}`;

    const url = `https://www.googleapis.com/upload/storage/v1/b/${FIREBASE_CONFIG.storageBucket}/o?uploadType=media&name=${encodeURIComponent(remotePath)}&key=${FIREBASE_CONFIG.apiKey}`;

    const options = {
      hostname: 'www.googleapis.com',
      path: `/upload/storage/v1/b/${FIREBASE_CONFIG.storageBucket}/o?uploadType=media&name=${encodeURIComponent(remotePath)}&key=${FIREBASE_CONFIG.apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': fileContent.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject({ status: res.statusCode, body });
        } else {
          const publicUrl = `https://storage.googleapis.com/${FIREBASE_CONFIG.storageBucket}/${remotePath}`;
          resolve(publicUrl);
        }
      });
    });

    req.on('error', reject);
    req.write(fileContent);
    req.end();
  });
}

async function uploadAllImages() {
  try {
    console.log(`\n📸 Iniciando upload de ${imagemFiles.length} imagens para Firebase Storage...\n`);

    const imageUrls = {};
    let sucessos = 0;

    for (const file of imagemFiles) {
      try {
        const filePath = path.join(produtosDir, file);
        console.log(`⏳ Enviando: ${file}`);

        const publicUrl = await uploadImage(filePath);
        imageUrls[file] = publicUrl;

        console.log(`✅ URL: ${publicUrl}`);
        sucessos++;

        // Delay para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.log(`❌ Erro: ${error.status || error.message}`);
      }
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ ${sucessos}/${imagemFiles.length} imagens enviadas com sucesso!`);
    console.log(`${'═'.repeat(60)}\n`);

    // Salvar mapeamento de URLs
    fs.writeFileSync(
      './public/produtos/image-urls.json',
      JSON.stringify(imageUrls, null, 2)
    );

    console.log(`📁 Mapeamento salvo em: ./public/produtos/image-urls.json\n`);
    console.log(`Próximo passo: Atualizar o catalogo-preparado.json com as URLs públicas\n`);

    process.exit(sucessos > 0 ? 0 : 1);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

uploadAllImages();
