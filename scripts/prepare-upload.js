#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║          🎨 PREPARADOR DE UPLOAD - HIAMARA CROCHÊ              ║
╚════════════════════════════════════════════════════════════════╝
`);

const produtosDir = './public/produtos';
const images = fs.readdirSync(produtosDir)
  .filter(f => f.endsWith('.jpeg'))
  .sort();

// Produtos principais que devem ser criados
const produtosTemplate = {
  amigurumis: [
    { nome: 'Amigurumi Anime Naruto', preco: 45.90, qtd_imgs: 4 },
    { nome: 'Amigurumi Sakura Rosa', preco: 48.90, qtd_imgs: 5 },
    { nome: 'Amigurumi Unicórnio Mágico', preco: 52.90, qtd_imgs: 5 },
    { nome: 'Amigurumi Baby Shark', preco: 42.90, qtd_imgs: 4 },
    { nome: 'Amigurumi Animais Diversos', preco: 46.90, qtd_imgs: 8 },
    { nome: 'Amigurumi Smiley Face', preco: 39.90, qtd_imgs: 3 },
    { nome: 'Amigurumi Personagens Variados', preco: 49.90, qtd_imgs: 10 }
  ],
  bolsas: [
    { nome: 'Bolsa Sacola Natural', preco: 89.90, qtd_imgs: 6 },
    { nome: 'Bolsa Sacola Colorida', preco: 94.90, qtd_imgs: 8 },
    { nome: 'Clutch de Crochê', preco: 65.90, qtd_imgs: 4 },
    { nome: 'Bolsa Estruturada Premium', preco: 119.90, qtd_imgs: 6 }
  ],
  roupas: [
    { nome: 'Blusa Azul Turquesa', preco: 129.90, qtd_imgs: 4 },
    { nome: 'Blusa Rosa Pastel', preco: 124.90, qtd_imgs: 4 },
    { nome: 'Blusa Creme Off-White', preco: 119.90, qtd_imgs: 3 },
    { nome: 'Top Summer Amarelo', preco: 99.90, qtd_imgs: 5 },
    { nome: 'Vestido Midi Crochê', preco: 189.90, qtd_imgs: 5 },
    { nome: 'Blusa Rendada Elegante', preco: 139.90, qtd_imgs: 4 }
  ]
};

// Gerar catálogo JSON
const catalogo = [];
let imgIndex = 0;

Object.entries(produtosTemplate).forEach(([categoria, produtos]) => {
  const categoriaNome = categoria === 'amigurumis' ? 'Bonecos' :
                        categoria === 'bolsas' ? 'Bolsas' : 'Roupas';

  produtos.forEach((produto, idx) => {
    if (imgIndex + produto.qtd_imgs <= images.length) {
      const fotos = [];
      for (let i = 0; i < produto.qtd_imgs; i++) {
        fotos.push({
          localFile: images[imgIndex + i],
          alt: produto.nome
        });
      }

      catalogo.push({
        nome: produto.nome,
        slug: produto.nome.toLowerCase()
          .normalize('NFD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
        categoria: categoriaNome,
        preco: produto.preco,
        descricao: `${produto.nome} - Feito à mão com crochê premium`,
        ativo: true,
        fotos: fotos,
        criado_em: new Date().toISOString()
      });

      imgIndex += produto.qtd_imgs;
    }
  });
});

// Salvar catálogo
const catalogoPath = './public/produtos/catalogo-preparado.json';
fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2));

console.log(`
📊 RESUMO DO CATÁLOGO PREPARADO
═════════════════════════════════════════════════════════════════

✅ Produtos criados: ${catalogo.length}
📷 Imagens utilizadas: ${imgIndex} / ${images.length}
📷 Imagens restantes: ${images.length - imgIndex}

DISTRIBUIÇÃO POR CATEGORIA:
───────────────────────────────────────────────────────────────
`);

const porCategoria = {};
catalogo.forEach(p => {
  if (!porCategoria[p.categoria]) porCategoria[p.categoria] = [];
  porCategoria[p.categoria].push(p);
});

Object.entries(porCategoria).forEach(([cat, prods]) => {
  console.log(`\n🧶 ${cat.toUpperCase()}`);
  prods.forEach((p, idx) => {
    console.log(`   ${idx + 1}. ${p.nome} (R$ ${p.preco.toFixed(2)}) - ${p.fotos.length} fotos`);
  });
});

console.log(`

📁 Catálogo salvo em: ${catalogoPath}

🚀 PRÓXIMOS PASSOS:
───────────────────────────────────────────────────────────────
1. Revise o arquivo ${catalogoPath}
2. Ajuste nomes, preços e descrições se necessário
3. Para upload com imagens locais:
   npm run upload:local
4. Para upload com Firestore + Storage:
   npm run upload:firebase

Nota: Você tem ${images.length - imgIndex} imagens não utilizadas.
Adicione mais produtos ao template se desejar usá-las!
`);
