#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const FormData = require('form-data');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║         📸 UPLOAD DE IMAGENS - FIREBASE STORAGE                ║
╚════════════════════════════════════════════════════════════════╝
`);

const FIREBASE_CONFIG = {
  storageBucket: 'gen-lang-client-0592600232.appspot.com',
  apiKey: 'AIzaSyAGUZ8hI_t0HWW3hJ8k7mN9pQ0rS1tU2vW'
};

const catalogoPath = './public/produtos/catalogo-preparado.json';
const catalogo = JSON.parse(fs.readFileSync(catalogoPath, 'utf-8'));
const produtosDir = './public/produtos';

async function uploadImagem(filePath, remotePath) {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

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

async function uploadTodasAsImagens() {
  try {
    console.log(`\n📸 Iniciando upload de imagens para Firebase Storage...\n`);

    let contador = 0;
    const imagensUploadadas = {};

    for (const produto of catalogo) {
      console.log(`\n📦 ${produto.nome}`);

      for (const foto of produto.fotos) {
        const imagemPath = path.join(produtosDir, foto.localFile);

        if (fs.existsSync(imagemPath)) {
          try {
            const remotePath = `produtos/${produto.slug}/${foto.localFile}`;
            console.log(`   ⏳ Enviando: ${foto.localFile}`);

            const publicUrl = await uploadImagem(imagemPath, remotePath);
            imagensUploadadas[foto.localFile] = publicUrl;

            console.log(`   ✅ URL: ${publicUrl}`);
            contador++;

            // Delay para evitar rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
          } catch (error) {
            console.log(`   ❌ Erro: ${error.status || error.message}`);
          }
        } else {
          console.log(`   ⚠️  Arquivo não encontrado: ${foto.localFile}`);
        }
      }
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ ${contador} imagens enviadas com sucesso!`);
    console.log(`${'═'.repeat(60)}\n`);

    // Salvar mapeamento de URLs
    fs.writeFileSync(
      './public/produtos/urls-imagens.json',
      JSON.stringify(imagensUploadadas, null, 2)
    );

    console.log(`📁 Mapeamento salvo em: ./public/produtos/urls-imagens.json`);
    console.log(`\n🔄 Próximo passo: Atualizar documentos no Firestore com as URLs\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

uploadTodasAsImagens();
