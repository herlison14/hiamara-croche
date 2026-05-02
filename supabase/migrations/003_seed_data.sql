-- Categorias completas HIAMARA CROCHÊ
INSERT INTO categorias (nome, slug, descricao, ordem) VALUES
  ('Roupas',          'roupas',         'Vestidos, blusas, saias e conjuntos em crochê artesanal',          1),
  ('Pelúcias',        'peluccias',      'Bonecos amigurumi e pelúcias feitos à mão com muito amor',          2),
  ('Tapetes',         'tapetes',        'Tapetes decorativos e funcionais em crochê para todos os ambientes', 3),
  ('Cortinas',        'cortinas',       'Cortinas e painéis decorativos em crochê para sua casa',            4),
  ('Bolsas & Tiaras', 'bolsas-tiaras',  'Bolsas, tiaras, turbantes e acessórios fashion em crochê',         5),
  ('Bebê & Infantil', 'bebe-infantil',  'Sapatinhos, body, mantas e enxoval de bebê em crochê',             6),
  ('Decoração Casa',  'decoracao-casa', 'Almofadas, porta-vasos, luminárias e peças decorativas',            7),
  ('Kits Presentes',  'kits-presentes', 'Kits exclusivos para presentear com amor e estilo artesanal',       8);

-- Configurações iniciais
INSERT INTO configuracoes (chave, valor, descricao) VALUES
  ('whatsapp',            '5521997927927', 'Número WhatsApp da loja'),
  ('instagram',           '@hiamaracroche','Instagram da loja'),
  ('frete_gratis_acima',  '150',           'Valor mínimo para frete grátis (R$)'),
  ('prazo_producao_dias', '7',             'Prazo padrão de produção em dias'),
  ('pix_chave',           'herlison14@gmail.com', 'Chave PIX da loja');
