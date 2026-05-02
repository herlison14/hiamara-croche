-- Categorias de produtos
CREATE TABLE categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  slug text UNIQUE NOT NULL,
  descricao text,
  imagem_url text,
  ordem int DEFAULT 0,
  ativo boolean DEFAULT true,
  criado_em timestamptz DEFAULT now()
);

-- Produtos
CREATE TABLE produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  slug text UNIQUE NOT NULL,
  descricao text,
  preco decimal(10,2) NOT NULL,
  preco_promocional decimal(10,2),
  categoria_id uuid REFERENCES categorias(id),
  imagens text[] DEFAULT '{}', -- array de URLs
  imagem_principal text,
  estoque int DEFAULT 0,
  ativo boolean DEFAULT true,
  destaque boolean DEFAULT false,
  mais_vendido boolean DEFAULT false,
  variantes jsonb DEFAULT '[]', -- [{nome: "Tamanho", opcoes: ["P","M","G"]}]
  tags text[] DEFAULT '{}',
  peso_gramas int,
  tempo_producao_dias int DEFAULT 7,
  criado_em timestamptz DEFAULT now(),
  atualizado_em timestamptz DEFAULT now()
);

-- Pedidos
CREATE TABLE pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text UNIQUE NOT NULL,
  status text DEFAULT 'aguardando_pagamento'
    CHECK (status IN ('aguardando_pagamento','pago','em_producao','enviado','entregue','cancelado')),

  -- Cliente
  cliente_nome text NOT NULL,
  cliente_email text NOT NULL,
  cliente_telefone text,

  -- Endereço
  endereco_cep text,
  endereco_rua text,
  endereco_numero text,
  endereco_complemento text,
  endereco_bairro text,
  endereco_cidade text,
  endereco_estado text,

  -- Financeiro
  subtotal decimal(10,2) NOT NULL,
  frete decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL,

  -- Pagamento
  pagamento_metodo text DEFAULT 'pix',
  pagamento_status text DEFAULT 'pendente'
    CHECK (pagamento_status IN ('pendente','aprovado','rejeitado','expirado')),
  pagamento_id text,               -- ID externo do Mercado Pago
  pagamento_qr_code text,          -- QR code PIX base64
  pagamento_pix_copia_cola text,   -- código PIX copia e cola
  pagamento_expiracao timestamptz,
  pagamento_confirmado_em timestamptz,

  -- Observações
  observacoes text,

  criado_em timestamptz DEFAULT now(),
  atualizado_em timestamptz DEFAULT now()
);

-- Itens do pedido
CREATE TABLE pedido_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id uuid REFERENCES produtos(id),
  produto_nome text NOT NULL,       -- snapshot no momento da compra
  produto_imagem text,
  variante_selecionada jsonb,       -- {tamanho: "M", cor: "Rosa"}
  quantidade int NOT NULL,
  preco_unitario decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL
);

-- Configurações da loja
CREATE TABLE configuracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text UNIQUE NOT NULL,
  valor text,
  descricao text,
  atualizado_em timestamptz DEFAULT now()
);

-- Fotos adicionais dos produtos (galeria atualizada constantemente)
CREATE TABLE produto_fotos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id uuid REFERENCES produtos(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text,
  ordem int DEFAULT 0,
  criado_em timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_ativo ON produtos(ativo);
CREATE INDEX idx_produtos_destaque ON produtos(destaque);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_email ON pedidos(cliente_email);
CREATE INDEX idx_pedidos_numero ON pedidos(numero);

-- Trigger para atualizar atualizado_em
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN NEW.atualizado_em = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_produtos_updated
  BEFORE UPDATE ON produtos
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

CREATE TRIGGER trg_pedidos_updated
  BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

-- Função para gerar número do pedido
CREATE OR REPLACE FUNCTION gerar_numero_pedido()
RETURNS text AS $$
  SELECT 'HC' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM()*9999+1)::text, 4, '0');
$$ LANGUAGE sql;
