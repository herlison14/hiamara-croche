# 🚀 Guia Completo de Upload de Produtos - HIAMARA CROCHÊ

## 📊 Status Atual

✅ **257 imagens** organizadas e prontas  
✅ **17 produtos** catalogados e mapeados  
✅ **88 imagens** distribuídas entre os produtos  
✅ **169 imagens** disponíveis para novos produtos

---

## 📦 Produtos Preparados

### 🧶 BONECOS (7 produtos)
1. **Amigurumi Anime Naruto** - R$ 45.90 (4 fotos)
2. **Amigurumi Sakura Rosa** - R$ 48.90 (5 fotos)
3. **Amigurumi Unicórnio Mágico** - R$ 52.90 (5 fotos)
4. **Amigurumi Baby Shark** - R$ 42.90 (4 fotos)
5. **Amigurumi Animais Diversos** - R$ 46.90 (8 fotos)
6. **Amigurumi Smiley Face** - R$ 39.90 (3 fotos)
7. **Amigurumi Personagens Variados** - R$ 49.90 (10 fotos)

### 👜 BOLSAS (4 produtos)
1. **Bolsa Sacola Natural** - R$ 89.90 (6 fotos)
2. **Bolsa Sacola Colorida** - R$ 94.90 (8 fotos)
3. **Clutch de Crochê** - R$ 65.90 (4 fotos)
4. **Bolsa Estruturada Premium** - R$ 119.90 (6 fotos)

### 👗 ROUPAS (6 produtos)
1. **Blusa Azul Turquesa** - R$ 129.90 (4 fotos)
2. **Blusa Rosa Pastel** - R$ 124.90 (4 fotos)
3. **Blusa Creme Off-White** - R$ 119.90 (3 fotos)
4. **Top Summer Amarelo** - R$ 99.90 (5 fotos)
5. **Vestido Midi Crochê** - R$ 189.90 (5 fotos)
6. **Blusa Rendada Elegante** - R$ 139.90 (4 fotos)

---

## 🔧 Como Fazer o Upload

### Opção 1: Upload via Firebase Console (Mais Fácil)

#### Passo 1: Abrir Firebase Console
```
https://console.firebase.google.com/
Selecione projeto: gen-lang-client-0592600232
```

#### Passo 2: Criar Collection "produtos"
1. Vá em **Firestore Database**
2. Clique em **+ Criar coleção**
3. Nome: `produtos`
4. Clique em **Próximo**

#### Passo 3: Adicionar Documentos
Para cada produto em `public/produtos/catalogo-preparado.json`:
1. Clique em **+ Adicionar documento**
2. Copie os dados do JSON (nome, slug, categoria, preço, etc)
3. Para fotos, adicione o array com URLs do Firebase Storage
4. Salve

### Opção 2: Upload Automático via Script (Mais Rápido)

#### Pré-requisitos:
```bash
npm install firebase-admin
```

#### Obter Chave de Serviço:
1. Firebase Console → ⚙️ Projeto → **Configurações do projeto**
2. Aba **Contas de serviço**
3. Clique em **Gerar nova chave privada**
4. Salve em local seguro: `~/firebase-key.json`

#### Executar Upload:
```bash
# Windows
set GOOGLE_APPLICATION_CREDENTIALS=%USERPROFILE%\firebase-key.json
node scripts/upload-to-firebase.js

# macOS/Linux
export GOOGLE_APPLICATION_CREDENTIALS=~/firebase-key.json
node scripts/upload-to-firebase.js
```

---

## 🎨 Customizar o Catálogo

Se quiser ajustar nomes, preços ou descrições:

1. Edite `public/produtos/catalogo-preparado.json`
2. Modifique os campos desejados
3. Salve o arquivo
4. Execute o script de upload

### Exemplo de ajuste:
```json
{
  "nome": "Amigurumi Naruto - Edição Especial",
  "preco": 59.90,
  "descricao": "Boneco Naruto em crochê com detalhes incríveis"
}
```

---

## 📷 Adicionar Mais Produtos

Você tem **169 imagens restantes**! Para criar mais produtos:

1. Edite o template em `scripts/prepare-upload.js`
2. Adicione novos produtos à seção correspondente
3. Execute: `node scripts/prepare-upload.js`
4. Faça o upload com: `node scripts/upload-to-firebase.js`

---

## 🔗 Firebase Storage

As imagens serão armazenadas em:
```
gs://gen-lang-client-0592600232.appspot.com/produtos/[categoria]/[imagem]
```

URLs públicas:
```
https://storage.googleapis.com/gen-lang-client-0592600232.appspot.com/produtos/[categoria]/[imagem]
```

---

## ✅ Verificar Upload

Depois do upload, verifique:

1. **Firebase Console** → Firestore → collection "produtos"
2. **Site** → abra http://localhost:3000
3. Os produtos devem aparecer com as fotos

---

## 🎯 Próximas Etapas

- [ ] Customizar nomes/preços se necessário
- [ ] Executar script de upload
- [ ] Verificar produtos no site
- [ ] Adicionar mais produtos com as 169 imagens restantes
- [ ] Deploy no Vercel

---

## 📞 Suporte

- **Arquivo de catálogo**: `public/produtos/catalogo-preparado.json`
- **Script de preparação**: `scripts/prepare-upload.js`
- **Script de upload**: `scripts/upload-to-firebase.js`
- **Todas as imagens**: `public/produtos/`

Tudo pronto para seu e-commerce de crochê! 🧶✨
