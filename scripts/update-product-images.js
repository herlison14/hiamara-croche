#!/usr/bin/env node

const fs = require('fs');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║    🎨 ATUALIZAR IMAGENS DOS PRODUTOS - PLACEHOLDERS            ║
╚════════════════════════════════════════════════════════════════╝
`);

// Imagens de placeholder por categoria do Unsplash
const CATEGORY_IMAGES = {
  'Bonecos': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&h=500&fit=crop&q=60',
  'Bolsas': 'https://images.unsplash.com/photo-1616996099207-4bc0e4eaf4b5?w=500&h=500&fit=crop&q=60',
  'Roupas': 'https://images.unsplash.com/photo-1615886287135-a987073e8f0d?w=500&h=500&fit=crop&q=60',
};

const catalogoPath = './public/produtos/catalogo-preparado.json';
const catalogo = JSON.parse(fs.readFileSync(catalogoPath, 'utf-8'));

console.log(`\n🔄 Atualizando ${catalogo.length} produtos...\n`);

let updated = 0;

catalogo.forEach((produto) => {
  const categoryImage = CATEGORY_IMAGES[produto.categoria];

  if (categoryImage) {
    // Substituir as fotos por placeholders
    produto.fotos = [
      {
        url: categoryImage,
        alt: `${produto.nome} - ${produto.categoria}`
      },
      {
        url: categoryImage,
        alt: `${produto.nome} - Vista alternativa`
      }
    ];

    console.log(`✅ ${produto.nome} (${produto.categoria})`);
    updated++;
  }
});

// Salvar catálogo atualizado
fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2));

console.log(`\n${'═'.repeat(60)}`);
console.log(`✅ ${updated} produtos atualizados!`);
console.log(`${'═'.repeat(60)}\n`);

console.log(`📝 Próximo passo: Atualizar Firestore com os novos dados\n`);

process.exit(0);
