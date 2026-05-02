const fs = require('fs');
const path = require('path');

const produtosDir = './public/produtos';
const images = fs.readdirSync(produtosDir).filter(f => f.endsWith('.jpeg')).sort();

console.log(`📊 Total de imagens encontradas: ${images.length}\n`);

// Estrutura de categorias
const categorias = {
  'amigurumis': {
    nome: 'Bonecos (Amigurumi)',
    descricao: 'Bonecos fofos de crochê - personagens, animais e muito mais',
    preco: 45.00,
    count: 0
  },
  'bolsas': {
    nome: 'Bolsas e Sacolas',
    descricao: 'Bolsas artesanais de crochê, sacolas decorativas',
    preco: 89.90,
    count: 0
  },
  'roupas': {
    nome: 'Roupas (Blusas, Tops, Vestidos)',
    descricao: 'Blusas, tops e vestidos de crochê feitos à mão',
    preco: 129.90,
    count: 0
  }
};

console.log('📁 IMAGENS LISTADAS (para categorização):\n');
images.forEach((img, idx) => {
  console.log(`${idx + 1}. ${img}`);
});

console.log(`\n✅ Total: ${images.length} imagens prontas para categorização`);
