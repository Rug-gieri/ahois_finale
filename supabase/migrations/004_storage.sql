-- Criar bucket 'produtos' no Storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage: leitura pública
CREATE POLICY "Produtos imagens publicas" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'produtos');

-- Políticas de Storage: upload autenticado
CREATE POLICY "Produtos upload autenticado" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'produtos');

-- Políticas de Storage: update autenticado
CREATE POLICY "Produtos update autenticado" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'produtos')
  WITH CHECK (bucket_id = 'produtos');

-- Políticas de Storage: delete autenticado
CREATE POLICY "Produtos delete autenticado" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'produtos');
