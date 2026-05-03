#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const config = {
  projectId: 'gen-lang-client-0592600232',
  apiKey: 'AIzaSyAGUZ8hI_t0HWW3hJ8k7mN9pQ0rS1tU2vW',
  storageBucket: 'gen-lang-client-0592600232.appspot.com'
};

const MAPPING_FILE = './scripts/image-mapping.json';
const PRODUCTS_DIR = './public/produtos';

const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf-8'));

console.log(`
╔════════════════════════════════════════════════════════════════╗
║        🔄 UPLOAD DE IMAGENS PARA FIREBASE STORAGE              ║
╚════════════════════════════════════════════════════════════════╝
`);

// Step 1: Rename local files
console.log('\n📝 RENOMEANDO ARQUIVOS LOCAIS:\n');

mapping.forEach(item => {
  const oldPath = path.join(PRODUCTS_DIR, item.imageName);
  const newFileName = `${item.tipo}_${item.productSlug}.jpeg`;
  const newPath = path.join(PRODUCTS_DIR, newFileName);

  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ ${item.imageName} → ${newFileName}`);
  } else {
    console.log(`⚠️  Arquivo não encontrado: ${item.imageName}`);
  }
});

console.log(`\n✅ Imagens renomeadas localmente`);

// Step 2: Create URL mapping for Firestore (using local paths that will be served)
console.log('\n📦 GERANDO MAPEAMENTO DE URLS:\n');

const firestoreUpdates = {};

mapping.forEach(item => {
  const localFileName = `${item.tipo}_${item.productSlug}.jpeg`;
  const localUrl = `/produtos/${localFileName}`;

  firestoreUpdates[item.productSlug] = {
    url: localUrl,
    alt: item.productName
  };

  console.log(`${item.productName}`);
  console.log(`  └─ ${localUrl}\n`);
});

// Step 3: Save for Firestore update
const updateFile = './scripts/firestore-image-updates.json';
fs.writeFileSync(updateFile, JSON.stringify(firestoreUpdates, null, 2));

console.log(`════════════════════════════════════════════════════════════════`);
console.log(`✅ URLs geradas e salvas em: ${updateFile}`);
console.log(`\n📌 PRÓXIMO PASSO: Atualizar URLs no Firestore`);
console.log(`════════════════════════════════════════════════════════════════\n`);
