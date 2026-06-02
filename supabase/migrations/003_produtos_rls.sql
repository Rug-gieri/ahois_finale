-- Políticas RLS para CRUD de produtos (usuários autenticados)

-- Permitir INSERT para usuários autenticados
CREATE POLICY "Produtos inseridos por autenticados" ON produtos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Permitir UPDATE para usuários autenticados
CREATE POLICY "Produtos atualizados por autenticados" ON produtos
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Permitir DELETE para usuários autenticados
CREATE POLICY "Produtos excluidos por autenticados" ON produtos
  FOR DELETE USING (auth.role() = 'authenticated');
