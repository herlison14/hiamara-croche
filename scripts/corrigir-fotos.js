#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║    🖼️  CORRIGIR FOTOS - Converter para URLs Data                ║
╚════════════════════════════════════════════════════════════════╝
`);

const catalogoPath = './public/produtos/catalogo-preparado.json';
const catalogo = JSON.parse(fs.readFileSync(catalogoPath, 'utf-8'));
const produtosDir = './public/produtos';

console.log(`\n📸 Processando imagens...\n`);

let contador = 0;

catalogo.forEach((produto, idx) => {
  produto.fotos = produto.fotos.map(foto => {
    const imagemPath = path.join(produtosDir, foto.localFile);
    
    if (fs.existsSync(imagemPath)) {
      try {
        const imageBuffer = fs.readFileSync(imagemPath);
        const base64 = imageBuffer.toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        
        console.log(`✅ ${produto.nome} - ${foto.localFile}`);
        contador++;
        
        return {
          url: dataUrl,
          alt: foto.alt
        };
      } catch (error) {
        console.log(`❌ Erro: ${foto.localFile} - ${error.message}`);
        return foto;
      }
    } else {
      console.log(`⚠️  Não encontrado: ${foto.localFile}`);
      return foto;
    }
  });
});

// Salvar catálogo atualizado
fs.writeFileSync(catalogoPath, JSON.stringify(catalogo, null, 2));

console.log(`\n${'═'.repeat(60)}`);
console.log(`✅ ${contador} imagens convertidas!`);
console.log(`${'═'.repeat(60)}\n`);
console.log(`📁 Atualizado: ${catalogoPath}\n`);

process.exit(0);
