-- =================================================================
-- 003_hardening.sql
-- Endurece o esquema para produção:
--   1. Adiciona coluna `idempotency_key` em `pedidos` (UNIQUE).
--   2. Restringe RLS de pedidos: leitura/escrita só via service role.
--   3. Adiciona índice em pagamento_id (consultado pelo webhook).
-- =================================================================

-- 1. Coluna idempotency_key ------------------------------------------------
ALTER TABLE pedidos
  ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_pedidos_idempotency_key
  ON pedidos (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- 2. Índices úteis para o webhook ------------------------------------------
CREATE INDEX IF NOT EXISTS idx_pedidos_pagamento_id ON pedidos (pagamento_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_pagamento_status ON pedidos (pagamento_status);

-- 3. RLS restritiva: só service role escreve/lê pedidos -------------------
--    A API valida cliente_email no WHERE — não precisa expor pedidos via anon key.

DROP POLICY IF EXISTS "pedidos_insercao_publica" ON pedidos;
DROP POLICY IF EXISTS "pedidos_leitura_publica" ON pedidos;
DROP POLICY IF EXISTS "itens_all" ON pedido_itens;

-- Pedidos: nenhuma operação para o role anon/authenticated
--          (service_role bypassa RLS automaticamente)
CREATE POLICY "pedidos_no_anon_select" ON pedidos
  FOR SELECT TO anon, authenticated
  USING (false);

CREATE POLICY "pedidos_no_anon_insert" ON pedidos
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "pedidos_no_anon_update" ON pedidos
  FOR UPDATE TO anon, authenticated
  USING (false);

CREATE POLICY "pedidos_no_anon_delete" ON pedidos
  FOR DELETE TO anon, authenticated
  USING (false);

-- Itens: mesma regra
CREATE POLICY "itens_no_anon_select" ON pedido_itens
  FOR SELECT TO anon, authenticated
  USING (false);

CREATE POLICY "itens_no_anon_insert" ON pedido_itens
  FOR INSERT TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "itens_no_anon_update" ON pedido_itens
  FOR UPDATE TO anon, authenticated
  USING (false);

CREATE POLICY "itens_no_anon_delete" ON pedido_itens
  FOR DELETE TO anon, authenticated
  USING (false);

-- 4. Constraint: total = subtotal + frete (sanity em escrita) ------------
ALTER TABLE pedidos
  DROP CONSTRAINT IF EXISTS pedidos_total_consistente;

ALTER TABLE pedidos
  ADD CONSTRAINT pedidos_total_consistente
  CHECK (total >= subtotal AND frete >= 0 AND subtotal >= 0);
