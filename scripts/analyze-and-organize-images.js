#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = './public/produtos';
const OUTPUT_FILE = './scripts/image-mapping.json';

// Product database from Firestore
const PRODUCTS = [
  { slug: 'clutch-croche', nome: 'Clutch de Crochê', categoria: 'Bolsas', tipo: 'bolsa' },
  { slug: 'blusa-rendada-elegante', nome: 'Blusa Rendada Elegante', categoria: 'Roupas', tipo: 'blusa' },
  { slug: 'amigurumi-personagens-variados', nome: 'Amigurumi Personagens Variados', categoria: 'Bonecos', tipo: 'amigurumi' },
  { slug: 'amigurumi-animais-diversos', nome: 'Amigurumi Animais Diversos', categoria: 'Bonecos', tipo: 'amigurumi' },
  { slug: 'amigurumi-unicornio-magico', nome: 'Amigurumi Unicórnio Mágico', categoria: 'Bonecos', tipo: 'amigurumi' },
  { slug: 'amigurumi-anime-naruto', nome: 'Amigurumi Anime Naruto', categoria: 'Bonecos', tipo: 'amigurumi' },
  { slug: 'bolsa-sacola-natural', nome: 'Bolsa Sacola Natural', categoria: 'Bolsas', tipo: 'bolsa' },
  { slug: 'blusa-rosa-pastel', nome: 'Blusa Rosa Pastel', categoria: 'Roupas', tipo: 'blusa' },
  { slug: 'amigurumi-smiley-face', nome: 'Amigurumi Smiley Face', categoria: 'Bonecos', tipo: 'amigurumi' },
  { slug: 'top-summer-amarelo', nome: 'Top Summer Amarelo', categoria: 'Roupas', tipo: 'blusa' },
];

console.log(`
╔════════════════════════════════════════════════════════════════╗
║         📸 ANÁLISE E ORGANIZAÇÃO DE IMAGENS DE CROCHÊ          ║
╚════════════════════════════════════════════════════════════════╝
`);

// Get all images
const files = fs.readdirSync(PRODUCTS_DIR).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));

console.log(`\n📁 Total de imagens encontradas: ${files.length}`);
console.log(`📦 Total de produtos no banco: ${PRODUCTS.length}\n`);

// Suggested mappings based on file order and product types
const SUGGESTED_MAPPING = {
  // Amigurumis (bonecos) - should be 5
  'WhatsApp Image 2026-05-02 at 16.48.04 (1).jpeg': 'amigurumi-anime-naruto',
  'WhatsApp Image 2026-05-02 at 16.48.04 (2).jpeg': 'amigurumi-smiley-face',
  'WhatsApp Image 2026-05-02 at 16.48.04 (3).jpeg': 'amigurumi-personagens-variados',
  'WhatsApp Image 2026-05-02 at 16.48.04.jpeg': 'amigurumi-animais-diversos',
  'WhatsApp Image 2026-05-02 at 16.48.05 (1).jpeg': 'amigurumi-unicornio-magico',

  // Bolsas - should be 2
  'WhatsApp Image 2026-05-02 at 16.48.05 (2).jpeg': 'clutch-croche',
  'WhatsApp Image 2026-05-02 at 16.48.05 (3).jpeg': 'bolsa-sacola-natural',

  // Roupas/Blusas - should be 3
  'WhatsApp Image 2026-05-02 at 16.48.05 (4).jpeg': 'blusa-rendada-elegante',
  'WhatsApp Image 2026-05-02 at 16.48.05 (5).jpeg': 'blusa-rosa-pastel',
  'WhatsApp Image 2026-05-02 at 16.48.05.jpeg': 'top-summer-amarelo',
};

console.log('📋 MAPEAMENTO SUGERIDO DE IMAGENS PARA PRODUTOS:\n');

const byCategory = {};
const mapping = [];

Object.entries(SUGGESTED_MAPPING).forEach(([imageName, productSlug]) => {
  const product = PRODUCTS.find(p => p.slug === productSlug);
  if (product) {
    if (!byCategory[product.categoria]) byCategory[product.categoria] = [];
    byCategory[product.categoria].push({ imageName, product });

    mapping.push({
      imageName,
      productSlug,
      productName: product.nome,
      categoria: product.categoria,
      tipo: product.tipo,
      newFileName: `${product.categoria.toLowerCase()}_${product.tipo}_${productSlug}.jpeg`
    });
  }
});

// Display by category
Object.entries(byCategory).sort().forEach(([cat, items]) => {
  console.log(`\n${cat}: ${items.length} produto(s)`);
  items.forEach(item => {
    console.log(`  📷 ${item.imageName}`);
    console.log(`     ➜ ${item.product.nome} (${item.product.slug})`);
  });
});

// Save mapping
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapping, null, 2));

console.log(`\n✅ Mapeamento salvo em: ${OUTPUT_FILE}`);
console.log(`\nPróximos passos:`);
console.log(`1. Renomear arquivos de imagem conforme mapeamento`);
console.log(`2. Fazer upload para Firebase Storage`);
console.log(`3. Atualizar URLs no Firestore`);
console.log(`4. Adicionar link do Instagram`);
console.log(`\n════════════════════════════════════════════════════════════════\n`);
