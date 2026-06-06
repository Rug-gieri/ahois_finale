interface RegiaoFrete {
  nome: string
  ufs: string[]
  pac: number
}

const REGIOES: Record<string, RegiaoFrete> = {
  NORTE:        { nome: 'Norte',        ufs: ['RO','AC','AM','RR','PA','AP','TO'], pac: 30 },
  NORDESTE:     { nome: 'Nordeste',     ufs: ['MA','PI','CE','RN','PB','PE','AL','SE','BA'], pac: 25 },
  CENTRO_OESTE: { nome: 'Centro-Oeste', ufs: ['MT','MS','GO','DF'], pac: 20 },
  SUDESTE:      { nome: 'Sudeste',      ufs: ['SP','RJ','MG','ES'], pac: 15 },
  SUL:          { nome: 'Sul',          ufs: ['PR','SC','RS'], pac: 15 },
}

export interface FreteResult {
  valor: number
  gratis: boolean
  motivo: string
  regiao: string
}

function isPortoVelho(cep: string): boolean {
  const prefix = parseInt(cep.replace(/\D/g, '').slice(0, 5), 10)
  return prefix >= 76801 && prefix <= 76834
}

function getRegiao(uf: string): RegiaoFrete | undefined {
  uf = uf.toUpperCase()
  for (const [, reg] of Object.entries(REGIOES)) {
    if (reg.ufs.includes(uf)) return reg
  }
  return undefined
}

export function calcularFrete(cep: string, uf: string, subtotal: number): FreteResult {
  if (!cep || !uf) {
    return { valor: 0, gratis: false, motivo: 'Informe o CEP e Estado', regiao: '' }
  }
  if (isPortoVelho(cep)) {
    return { valor: 0, gratis: true, motivo: 'Frete grátis — entrega local em Porto Velho', regiao: 'Norte' }
  }
  if (subtotal >= 150) {
    const regiao = getRegiao(uf)
    return { valor: 0, gratis: true, motivo: 'Frete grátis (compras acima de R$150)', regiao: regiao?.nome ?? '' }
  }
  const regiao = getRegiao(uf)
  if (!regiao) {
    return { valor: 0, gratis: true, motivo: 'Região não identificada', regiao: '' }
  }
  return { valor: regiao.pac, gratis: false, motivo: `Frete PAC — ${regiao.nome}`, regiao: regiao.nome }
}
