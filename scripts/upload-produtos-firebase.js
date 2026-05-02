const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar Firebase Admin
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  console.error('❌ Defina GOOGLE_APPLICATION_CREDENTIALS com o caminho para sua chave de serviço');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  storageBucket: 'gen-lang-client-0592600232.firebasestorage.googleapis.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Estrutura dos produtos com múltiplas imagens
const produtos = [
  // AMIGURUMIS (Bonecos)
  {
    nome: 'Amigurumi Personagem Anime',
    slug: 'amigurumi-naruto',
    categoria: 'Bonecos',
    preco: 45.90,
    descricao: 'Boneco adorável de crochê inspirado em personagens anime. Feito à mão com detalhes precisos.',
    ativo: true,
    imagens: ['WhatsApp Image 2026-05-02 at 16.48.04.jpeg', 'WhatsApp Image 2026-05-02 at 16.48.04 (1).jpeg'],
    criado_em: new Date()
  },
  {
    nome: 'Amigurumi com Cabelo Colorido',
    slug: 'amigurumi-colorido',
    categoria: 'Bonecos',
    preco: 48.90,
    descricao: 'Boneco fofo de crochê com cabelo rosa vibrante e roupa vermelha. Perfeito como presente.',
    ativo: true,
    imagens: ['WhatsApp Image 2026-05-02 at 16.48.05.jpeg', 'WhatsApp Image 2026-05-02 at 16.48.05 (1).jpeg'],
    criado_em: new Date()
  },
  {
    nome: 'Amigurumi Unicórnio',
    slug: 'amigurumi-unicornio',
    categoria: 'Bonecos',
    preco: 52.90,
    descricao: 'Unicórnio fofo e mágico de crochê com detalhes em cores pastel. Ideal para crianças e colecionadores.',
    ativo: true,
    imagens: ['WhatsApp Image 2026-05-02 at 16.48.12 (2).jpeg', 'WhatsApp Image 2026-05-02 at 16.48.12 (3).jpeg'],
    criado_em: new Date()
  },

  // BOLSAS
  {
    nome: 'Bolsa Sacola de Crochê',
    slug: 'bolsa-sacola-floral',
    categoria: 'Bolsas',
    preco: 89.90,
    descricao: 'Bolsa espaçosa de crochê com padrão floral em tons naturais. Perfeita para o dia a dia.',
    ativo: true,
    imagens: ['WhatsApp Image 2026-05-02 at 16.48.07 (1).jpeg', 'WhatsApp Image 2026-05-02 at 16.48.08 (1).jpeg'],
    criado_em: new Date()
  },

  // ROUPAS
  {
    nome: 'Blusa de Crochê Azul Turquesa',
    slug: 'blusa-azul-turquesa',
    categoria: 'Roupas',
    preco: 129.90,
    descricao: 'Blusa elegante de crochê em tom azul turquesa. Confortável e com design sofisticado para todas as ocasiões.',
    ativo: true,
    imagens: ['WhatsApp Image 2026-05-02 at 16.48.09.jpeg', 'WhatsApp Image 2026-05-02 at 16.48.10.jpeg'],
    criado_em: new Date()
  }
];

async function uploadProdutos() {
  try {
    console.log('🚀 Iniciando upload de produtos com imagens...\n');

    const batch = db.batch();

    for (const produto of produtos) {
      // Preparar dados do produto
      const produtoData = {
        nome: produto.nome,
        slug: produto.slug,
        categoria: produto.categoria,
        preco: produto.preco,
        descricao: produto.descricao,
        ativo: produto.ativo,
        fotos: [],
        criado_em: admin.firestore.Timestamp.fromDate(produto.criado_em)
      };

      // Processar imagens
      console.log(`📦 Processando: ${produto.nome}`);

      const imageDir = './public/produtos';
      for (const imagemNome of produto.imagens) {
        const imagemPath = path.join(imageDir, imagemNome);

        if (fs.existsSync(imagemPath)) {
          try {
            // Upload para Firebase Storage
            const firebasePath = `produtos/${produto.slug}/${imagemNome}`;
            await bucket.upload(imagemPath, {
              destination: firebasePath,
              metadata: {
                contentType: 'image/jpeg'
              }
            });

            // Gerar URL pública
            const publicUrl = `https://storage.googleapis.com/gen-lang-client-0592600232.appspot.com/${firebasePath}`;

            produtoData.fotos.push({
              url: publicUrl,
              alt: produto.nome
            });

            console.log(`   ✅ Imagem enviada: ${imagemNome}`);
          } catch (error) {
            console.log(`   ⚠️ Erro ao enviar ${imagemNome}: ${error.message}`);
          }
        }
      }

      // Adicionar produto ao Firestore
      const docRef = db.collection('produtos').doc();
      batch.set(docRef, produtoData);
      console.log(`   ✨ Produto criado: ${produto.nome}\n`);
    }

    await batch.commit();
    console.log(`\n✅ ${produtos.length} produtos uploadados com sucesso!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante upload:', error);
    process.exit(1);
  }
}

uploadProdutos();
