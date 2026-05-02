// Script para popular Firestore com dados de exemplo
// Execute: node scripts/seed-firebase.js

const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  console.error('❌ Defina GOOGLE_APPLICATION_CREDENTIALS com o caminho para sua chave de serviço do Firebase');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();

const produtosExemplo = [
  {
    nome: 'Blusa de Crochê Rosa',
    slug: 'blusa-rosa',
    preco: 89.90,
    categoria: 'Blusas',
    fotos: [
      {
        url: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'500\' height=\'500\'%3E%3Crect fill=\'%23f5d7d3\' width=\'500\' height=\'500\'/%3E%3Ctext x=\'50%25\' y=\'40%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'serif\' font-size=\'24\' fill=\'%23654321\'%3E🧶%3C/text%3E%3Ctext x=\'50%25\' y=\'60%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'serif\' font-size=\'20\' fill=\'%23654321\' font-weight=\'bold\'%3EBlusa%20Rosa%3C/text%3E%3C/svg%3E',
        alt: 'Blusa de Crochê Rosa',
      },
    ],
    descricao: 'Blusa de crochê em tons rosa, confeccionada à mão com fios premium.',
    ativo: true,
    criado_em: new Date(),
  },
  {
    nome: 'Boneco de Crochê Amigurumi',
    slug: 'amigurumi',
    preco: 45.90,
    categoria: 'Bonecos',
    fotos: [
      {
        url: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'500\' height=\'500\'%3E%3Crect fill=\'%23f0e6d8\' width=\'500\' height=\'500\'/%3E%3Ctext x=\'50%25\' y=\'40%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'serif\' font-size=\'24\' fill=\'%23654321\'%3E🧶%3C/text%3E%3Ctext x=\'50%25\' y=\'60%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'serif\' font-size=\'20\' fill=\'%23654321\' font-weight=\'bold\'%3EAmigurumi%3C/text%3E%3C/svg%3E',
        alt: 'Boneco de Crochê Amigurumi',
      },
    ],
    descricao: 'Adorável boneco Amigurumi feito à mão com segurança e amor.',
    ativo: true,
    criado_em: new Date(),
  },
  {
    nome: 'Bolsa de Crochê Artesanal',
    slug: 'bolsa-artesanal',
    preco: 129.90,
    categoria: 'Bolsas',
    fotos: [
      {
        url: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'500\' height=\'500\'%3E%3Crect fill=\'%23e8d4c4\' width=\'500\' height=\'500\'/%3E%3Ctext x=\'50%25\' y=\'40%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'serif\' font-size=\'24\' fill=\'%23654321\'%3E🧶%3C/text%3E%3Ctext x=\'50%25\' y=\'60%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'serif\' font-size=\'20\' fill=\'%23654321\' font-weight=\'bold\'%3EBolsa%20Artesanal%3C/text%3E%3C/svg%3E',
        alt: 'Bolsa de Crochê Artesanal',
      },
    ],
    descricao: 'Bolsa de crochê única em padrão artesanal, perfeita para o dia a dia.',
    ativo: true,
    criado_em: new Date(),
  },
  {
    nome: 'Top de Crochê Summer',
    slug: 'top-summer',
    preco: 65.90,
    categoria: 'Blusas',
    fotos: [
      {
        url: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'500\' height=\'500\'%3E%3Crect fill=\'%23fff0e6\' width=\'500\' height=\'500\'/%3E%3Ctext x=\'50%25\' y=\'40%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'serif\' font-size=\'24\' fill=\'%23654321\'%3E🧶%3C/text%3E%3Ctext x=\'50%25\' y=\'60%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'serif\' font-size=\'20\' fill=\'%23654321\' font-weight=\'bold\'%3ETop%20Summer%3C/text%3E%3C/svg%3E',
        alt: 'Top de Crochê Summer',
      },
    ],
    descricao: 'Top leve e arejado de crochê, ideal para o verão.',
    ativo: true,
    criado_em: new Date(),
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando preenchimento do Firestore...');

    const batch = db.batch();
    const colecao = db.collection('produtos');

    for (const produto of produtosExemplo) {
      const docRef = colecao.doc();
      batch.set(docRef, produto);
    }

    await batch.commit();
    console.log(`✅ ${produtosExemplo.length} produtos adicionados com sucesso!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao preencher banco de dados:', error);
    process.exit(1);
  }
}

seedDatabase();
