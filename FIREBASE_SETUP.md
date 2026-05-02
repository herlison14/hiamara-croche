# Setup Firebase Firestore (Gratuito)

## 1. Criar projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar Projeto"
3. Nome: `hiamara-croche`
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar"

## 2. Obter configuração do Firebase

1. No Firebase Console, acesse "Configurações do Projeto"
2. Role até "Seus aplicativos"
3. Clique no ícone `</>` para Web
4. Copie o objeto `firebaseConfig`

## 3. Atualizar variáveis de ambiente

No arquivo `.env.local`, adicione:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=seu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-messaging-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
```

## 4. Criar coleção de Produtos no Firestore

1. No Firebase Console, acesse "Firestore Database"
2. Clique em "Criar Banco de Dados"
3. Modo: "Iniciar em modo de teste"
4. Região: "South America (São Paulo)" ou próxima
5. Clique em "Criar"

### Criar coleção "produtos"

1. Clique em "Iniciar coleção"
2. ID da coleção: `produtos`
3. Adicione documentos com campos:
   - `id` (string)
   - `nome` (string)
   - `preco` (number)
   - `categoria` (string)
   - `fotos` (array)
     - `url` (string - link Unsplash)
     - `alt` (string - descrição)
   - `descricao` (string)
   - `ativo` (boolean)

### Exemplo de documento:

```json
{
  "id": "1",
  "nome": "Blusa de Crochê Rosa",
  "preco": 89.90,
  "categoria": "Blusas",
  "fotos": [
    {
      "url": "https://images.unsplash.com/photo-1590080876-a4ca66a87c3d?w=500",
      "alt": "Blusa de Crochê Rosa"
    }
  ],
  "descricao": "Blusa de crochê em tons rosa, confeccionada à mão",
  "ativo": true
}
```

## 5. Criar componente para buscar dados do Firebase

```typescript
// components/produtosFirebase.tsx
'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export function useProdutos() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const q = query(collection(db, 'produtos'), where('ativo', '==', true))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map(doc => doc.data())
        setProdutos(data)
      } catch (error) {
        console.error('Erro ao buscar produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProdutos()
  }, [])

  return { produtos, loading }
}
```

## 6. Regras de Segurança Firestore

No Firebase Console, acesse "Firestore Database > Regras":

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública de produtos
    match /produtos/{document=**} {
      allow read;
      allow write: if false;
    }
    
    // Permitir escrita apenas com token de admin
    match /admin/{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 7. Plano Gratuito Firebase

✅ **Firestore Database:**
- Até 50.000 leituras/dia
- 20.000 escritas/dia
- 20.000 exclusões/dia

✅ **Storage:**
- 5GB de armazenamento
- 1GB de downloads/mês

Perfeito para e-commerce pequeno! 🚀

## Próximos Passos

1. Configure as variáveis de ambiente
2. Crie a coleção de produtos no Firestore
3. Atualize `ProdutosColecao.tsx` para usar Firebase
4. Teste o carregamento de dados

Dúvidas? Consulte: https://firebase.google.com/docs/firestore
