CREATE TABLE enderecos (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('oficina','evento','entrega')),
  logradouro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT,
  mapa_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enderecos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enderecos visiveis para todos" ON enderecos FOR SELECT USING (true);
CREATE POLICY "Enderecos editaveis via anon key" ON enderecos FOR ALL USING (true);

CREATE TRIGGER enderecos_updated_at
  BEFORE UPDATE ON enderecos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
