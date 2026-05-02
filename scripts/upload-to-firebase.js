#!/usr/bin/env node

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║         🚀 UPLOAD PARA FIREBASE - HIAMARA CROCHÊ               ║
╚════════════════════════════════════════════════════════════════╝
`);

// Verificar credenciais
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  console.error(`
❌ ERRO: Variável GOOGLE_APPLICATION_CREDENTIALS não encontrada!

Para usar este script, você precisa:
1. Baixar a chave de serviço do Firebase
2. Salvar em uma pasta segura
3. Executar com:
   GOOGLE_APPLICATION_CREDENTIALS="/caminho/para/serviceAccountKey.json" node scripts/upload-to-firebase.js
`);
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
    storageBucket: 'gen-lang-client-0592600232.firebasestorage.googleapis.com'
  });
} catch (error) {
  console.error('❌ Erro ao inicializar Firebase:', error.message);
  process.exit(1);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Carregar catálogo
const catalogoPath = './public/produtos/catalogo-preparado.json';
const catalogo = JSON.parse(fs.readFileSync(catalogoPath, 'utf-8'));

async function uploadProdutos() {
  try {
    console.log(`\n📦 Iniciando upload de ${catalogo.length} produtos...\n`);

    let sucessos = 0;
    let erros = 0;

    for (const produto of catalogo) {
      try {
        console.log(`\n⏳ Processando: ${produto.nome}`);

        // Preparar dados do produto
        const produtoData = {
          nome: produto.nome,
          slug: produto.slug,
          categoria: produto.categoria,
          preco: produto.preco,
          descricao: produto.descricao,
          ativo: produto.ativo,
          fotos: [],
          criado_em: admin.firestore.Timestamp.now()
        };

        // Upload das imagens
        for (const foto of produto.fotos) {
          const imagemPath = path.join('./public/produtos', foto.localFile);

          if (fs.existsSync(imagemPath)) {
            try {
              const firebasePath = `produtos/${produto.slug}/${foto.localFile}`;

              // Upload para Storage
              await bucket.upload(imagemPath, {
                destination: firebasePath,
                metadata: {
                  contentType: 'image/jpeg',
                  cacheControl: 'public, max-age=31536000'
                }
              });

              // Gerar URL pública
              const publicUrl = `https://storage.googleapis.com/gen-lang-client-0592600232.appspot.com/${firebasePath}`;

              produtoData.fotos.push({
                url: publicUrl,
                alt: produto.nome
              });

              console.log(`   ✅ Foto: ${foto.localFile}`);
            } catch (error) {
              console.log(`   ⚠️  Erro na foto ${foto.localFile}: ${error.message}`);
            }
          }
        }

        // Salvar produto no Firestore
        const docRef = await db.collection('produtos').add(produtoData);
        console.log(`   ✨ Produto criado: ${docRef.id}`);
        sucessos++;
      } catch (error) {
        console.error(`   ❌ Erro ao processar ${produto.nome}:`, error.message);
        erros++;
      }
    }

    console.log(`

╔════════════════════════════════════════════════════════════════╗
║                    ✅ UPLOAD COMPLETO!                        ║
╚════════════════════════════════════════════════════════════════╝

📊 Resultado:
   ✅ Produtos criados: ${sucessos}
   ❌ Erros: ${erros}
   📷 Total de fotos: ${catalogo.reduce((acc, p) => acc + p.fotos.length, 0)}

🌐 Acesse: https://console.firebase.google.com/
   Projeto: gen-lang-client-0592600232
   Collection: produtos

🎉 Seus produtos estão prontos para exibição no site!
`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante upload:', error);
    process.exit(1);
  }
}

uploadProdutos();
