#!/usr/bin/env node

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

// Load Firebase credentials
const keyPath = path.join(process.env.HOME || process.env.USERPROFILE, '.firebase-credentials.json');

if (!fs.existsSync(keyPath)) {
  console.error('❌ Firebase credentials not found at:', keyPath);
  console.log('\nTo diagnose, you need firebase-admin credentials.');
  console.log('Place your service account key at:', keyPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function diagnose() {
  console.log('\n📊 DIAGNOSING FIRESTORE DATA\n');
  console.log('═'.repeat(60));

  try {
    // Get all products
    const snapshot = await db.collection('produtos').get();
    console.log(`\n✅ Found ${snapshot.size} total products\n`);

    if (snapshot.size === 0) {
      console.log('❌ No products in Firestore!');
      process.exit(1);
    }

    // Analyze categories
    const categories = {};
    const categoryValues = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      const cat = data.categoria;
      categoryValues.add(cat);
      categories[cat] = (categories[cat] || 0) + 1;
    });

    console.log('📦 PRODUCTS BY CATEGORY:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  "${cat}": ${count} products`);
    });

    console.log('\n📝 UNIQUE CATEGORIA VALUES IN DB:');
    Array.from(categoryValues).forEach(cat => {
      console.log(`  - "${cat}" (type: ${typeof cat})`);
    });

    // Test normalization
    const normalizeCategory = (category) => {
      const categoryMap = {
        'bonecos': 'Bonecos',
        'bolsas': 'Bolsas',
        'roupas': 'Roupas'
      };
      return categoryMap[category.toLowerCase()] || category;
    };

    console.log('\n🔄 NORMALIZATION TESTS:');
    ['bonecos', 'bolsas', 'roupas', 'Bonecos', 'Bolsas', 'Roupas'].forEach(cat => {
      const normalized = normalizeCategory(cat);
      const match = categories[normalized] ? '✅' : '❌';
      console.log(`  "${cat}" → "${normalized}" ${match}`);
    });

    // Check a sample product
    console.log('\n📋 SAMPLE PRODUCT:');
    const sample = snapshot.docs[0].data();
    console.log(`  ID: ${snapshot.docs[0].id}`);
    console.log(`  Nome: ${sample.nome}`);
    console.log(`  Categoria: "${sample.categoria}" (type: ${typeof sample.categoria})`);
    console.log(`  Ativo: ${sample.ativo}`);
    console.log(`  Fotos: ${sample.fotos?.length || 0} images`);
    if (sample.fotos?.[0]) {
      console.log(`    First image URL length: ${sample.fotos[0].url?.length || 'N/A'} chars`);
    }

    console.log('\n' + '═'.repeat(60));

    // Test query
    console.log('\n🔍 TESTING QUERIES:\n');

    for (const [cat, count] of Object.entries(categories)) {
      const q = db.collection('produtos')
        .where('ativo', '==', true)
        .where('categoria', '==', cat);

      const result = await q.get();
      const status = result.size === count ? '✅' : '❌';
      console.log(`  Query for categoria="${cat}": ${result.size} products ${status}`);
    }

    console.log('\n' + '═'.repeat(60));
    console.log('✅ Diagnosis complete\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

diagnose();
