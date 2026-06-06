export interface ProductDetails {
  materiais: string
  tamanho: string
  cores: string[]
  cuidados: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  details: ProductDetails
  image_url: string
}

export const categorias = [
  "Amigurumi",
  "Casa & Decoração",
  "Baby",
  "Acessórios",
] as const

export const exemplares = [
  {
    id: 1,
    name: "Coelhinho Amigurumi",
    description: "Coelhinho de crochê com aproximadamente 20cm, perfeito para presentear.",
    price: 59.90,
    category: "Amigurumi",
    image_url: "/images/1.webp",
    details: {
      materiais: "Fio 100% algodão, enchimento hipoalergênico",
      tamanho: "~20cm de altura",
      cores: ["Branco", "Bege", "Rosa claro"],
      cuidados: "Lavar à mão com água fria, secar à sombra",
    },
  },
  {
    id: 2,
    name: "Ursinho Poff",
    description: "Ursinho fofo de crochê com detalhes em cores pastel.",
    price: 69.90,
    category: "Amigurumi",
    image_url: "/images/2.webp",
    details: {
      materiais: "Fio 100% algodão, enchimento hipoalergênico",
      tamanho: "~25cm de altura",
      cores: ["Bege", "Marrom claro", "Rosa"],
      cuidados: "Lavar à mão com água fria, secar à sombra",
    },
  },
  {
    id: 3,
    name: "Cesta Decorativa",
    description: "Cesta de crochê para organização e decoração. Disponível em várias cores.",
    price: 45.00,
    category: "Casa & Decoração",
    image_url: "/images/3.webp",
    details: {
      materiais: "Fio de algodão reciclado, reforço interno",
      tamanho: "~18cm diâmetro x 12cm altura",
      cores: ["Bege natural", "Marrom", "Cru", "Verde musgo"],
      cuidados: "Limpar com pano úmido, não molhar completamente",
    },
  },
  {
    id: 4,
    name: "Manta de Sofá",
    description: "Manta de crochê para sofá, feita com fio 100% algodão.",
    price: 129.90,
    category: "Casa & Decoração",
    image_url: "/images/4.webp",
    details: {
      materiais: "Fio 100% algodão grosso",
      tamanho: "~150cm x 120cm",
      cores: ["Bege", "Cru", "Marrom", "Terracota"],
      cuidados: "Lavar em ciclo delicado, secar à sombra",
    },
  },
  {
    id: 5,
    name: "Tapete Retalho",
    description: "Tapete colorido de crochê feito com retalhos de tecido. Resistente e lavável.",
    price: 89.90,
    category: "Casa & Decoração",
    image_url: "/images/5.webp",
    details: {
      materiais: "Retalhos de tecido 100% algodão, base antiderrapante",
      tamanho: "~80cm x 50cm (personalizável)",
      cores: ["Colorido", "Tons terrosos", "Pastel"],
      cuidados: "Lavar à mão, secar à sombra, não usar máquina",
    },
  },
  {
    id: 6,
    name: "Manta Bebê",
    description: "Manta macia de crochê para bebê. Ideal para enxoval.",
    price: 79.90,
    category: "Baby",
    image_url: "/images/6.jpg",
    details: {
      materiais: "Fio 100% algodão premium, enchimento macio",
      tamanho: "~75cm x 75cm",
      cores: ["Branco", "Rosa bebê", "Azul bebê", "Verde menta"],
      cuidados: "Lavar em ciclo delicado, sabão neutro, secar à sombra",
    },
  },
  {
    id: 7,
    name: "Bota Crochê",
    description: "Botinha de crochê para bebê de 0 a 6 meses. Super macia e delicada.",
    price: 34.90,
    category: "Baby",
    image_url: "/images/7.jpg",
    details: {
      materiais: "Fio 100% algodão, solado antiderrapante",
      tamanho: "0-6 meses (~9cm)",
      cores: ["Branco", "Bege", "Rosa", "Azul"],
      cuidados: "Lavar à mão, secar à sombra",
    },
  },
  {
    id: 8,
    name: "Golinha Elizabete",
    description: "Gola de crochê com design moderno. Aquece e estiliza qualquer look.",
    price: 49.90,
    category: "Acessórios",
    image_url: "/images/8.jpg",
    details: {
      materiais: "Fio 100% algodão, fechamento em botão forrado",
      tamanho: "Único (ajustável ~50-65cm)",
      cores: ["Bege claro", "Marrom", "Vinho", "Preto"],
      cuidados: "Lavar à mão com água fria, secar na horizontal",
    },
  },
  {
    id: 9,
    name: "Bolsa Cesta",
    description: "Bolsa de crochê estilo cesta com alça em couro. Ideal para o dia a dia.",
    price: 74.90,
    category: "Acessórios",
    image_url: "/images/9.jpg",
    details: {
      materiais: "Fio de algodão reciclado, alça em couro sintético, forro interno",
      tamanho: "~30cm largura x 25cm altura",
      cores: ["Bege natural", "Marrom", "Preto"],
      cuidados: "Limpar com pano úmido, evitar exposição prolongada ao sol",
    },
  },
]
