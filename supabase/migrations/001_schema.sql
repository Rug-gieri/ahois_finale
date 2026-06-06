-- Crie um bucket 'produtos' no Storage do Supabase (dashboard > Storage > Create bucket)
-- com políticas de leitura pública e escrita autenticada.

-- Produtos artesanais
CREATE TABLE produtos (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  details JSONB DEFAULT jsonb_build_object(
    'materiais', '',
    'tamanho', '',
    'cores', '[]'::jsonb,
    'cuidados', ''
  ),
  image_url TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clientes
CREATE TABLE clientes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos via WhatsApp
CREATE TABLE pedidos (
  id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT REFERENCES clientes(id),
  cliente_nome TEXT,
  cliente_phone TEXT,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_produtos_category ON produtos(category);
CREATE INDEX idx_produtos_active ON produtos(active);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_clientes_phone ON clientes(phone);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER produtos_updated_at
  BEFORE UPDATE ON produtos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (opcional — ativar via dashboard)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Políticas: leitura pública para produtos, escrita autenticada para clientes/pedidos
CREATE POLICY "Produtos visiveis para todos" ON produtos
  FOR SELECT USING (true);

CREATE POLICY "Clientes podem ser inseridos via anon key" ON clientes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Pedidos podem ser inseridos via anon key" ON pedidos
  FOR INSERT WITH CHECK (true);
