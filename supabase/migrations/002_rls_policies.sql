-- Enable RLS
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE produto_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- Produtos: leitura pública para ativos
CREATE POLICY "produtos_leitura_publica" ON produtos
  FOR SELECT USING (ativo = true);

-- Categorias: leitura pública para ativas
CREATE POLICY "categorias_leitura_publica" ON categorias
  FOR SELECT USING (ativo = true);

-- Produto fotos: leitura pública
CREATE POLICY "fotos_leitura_publica" ON produto_fotos
  FOR SELECT USING (true);

-- Pedidos: inserção pública (qualquer um pode criar pedido)
CREATE POLICY "pedidos_insercao_publica" ON pedidos
  FOR INSERT WITH CHECK (true);

-- Pedidos: leitura por email (sem auth, apenas por numero+email)
CREATE POLICY "pedidos_leitura_publica" ON pedidos
  FOR SELECT USING (true);

-- Itens: inserção e leitura pública
CREATE POLICY "itens_all" ON pedido_itens
  FOR ALL USING (true);

-- Configurações: leitura pública
CREATE POLICY "config_leitura" ON configuracoes
  FOR SELECT USING (true);
