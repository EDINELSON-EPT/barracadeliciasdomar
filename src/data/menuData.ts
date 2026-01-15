export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "peixes",
    name: "Peixes",
    icon: "🐟",
    items: [
      { id: "p1", name: "Pratiqueira", description: "Arroz, farofa e vinagrete", price: 60.00, category: "peixes" },
      { id: "p2", name: "Pescadinha (3 Und. Grande)", description: "Arroz, farofa e vinagrete", price: 75.00, category: "peixes" },
      { id: "p3", name: "Pescadinha (6 Und. Pequena)", description: "Arroz, farofa e vinagrete", price: 70.00, category: "peixes" },
      { id: "p4", name: "Filé de Pescada Adoré", description: "Arroz, farofa e feijão", price: 85.00, category: "peixes" },
      { id: "p5", name: "Filé de Pescada Adoré c/ Fritas", description: "Arroz, farofa e feijão", price: 100.00, category: "peixes" },
      { id: "p6", name: "Filé de Pescada na Chapa com Fritas", description: "Arroz, farofa e feijão", price: 110.00, category: "peixes" },
      { id: "p7", name: "Isca", description: "Farofa e molho rosê", price: 70.00, category: "peixes" },
      { id: "p8", name: "Isca c/ Fritas", description: "Farofa e molho rosê", price: 80.00, category: "peixes" },
      { id: "p9", name: "Isca c/ Fritas completa", description: "Arroz, farofa e feijão", price: 90.00, category: "peixes" },
      { id: "p10", name: "Camarão ao Alho e Óleo", description: "Farofa", price: 90.00, category: "peixes" },
      { id: "p11", name: "Camarão à Milanesa", description: "Arroz e farofa", price: 100.00, category: "peixes" },
      { id: "p12", name: "Caranguejo Toc-Toc", description: "Farofa e vinagrete", price: 60.00, category: "peixes" },
      { id: "p13", name: "Enchova Corvina P", description: "", price: 150.00, category: "peixes" },
      { id: "p14", name: "Enchova Corvina M", description: "", price: 180.00, category: "peixes" },
      { id: "p15", name: "Enchova Corvina G", description: "", price: 200.00, category: "peixes" },
      { id: "p16", name: "Pratiqueira Simples", description: "Farofa e vinagrete", price: 50.00, category: "peixes" },
      { id: "p17", name: "Camarão à Milanesa Completo", description: "Arroz, farofa e fritas", price: 130.00, category: "peixes" },
      { id: "p18", name: "Pescadinha Completa", description: "Arroz, feijão, farofa e vinagrete", price: 100.00, category: "peixes" },
    ]
  },
  {
    id: "carnes",
    name: "Carnes",
    icon: "🥩",
    items: [
      { id: "c1", name: "Filé de Carne na Chapa", description: "Farofa, arroz e feijão", price: 100.00, category: "carnes" },
      { id: "c2", name: "Filé de Carne na Chapa c/ Fritas", description: "Farofa, arroz", price: 110.00, category: "carnes" },
      { id: "c3", name: "Filé de Carne na Chapa a Cavalo", description: "Fritas, arroz, farofa e feijão", price: 120.00, category: "carnes" },
      { id: "c4", name: "Bife a Cavalo", description: "Fritas, farofa, arroz e feijão", price: 90.00, category: "carnes" },
      { id: "c5", name: "Bife Acebolado", description: "Farofa, arroz e feijão", price: 80.00, category: "carnes" },
      { id: "c6", name: "Frango na Chapa", description: "Farofa, arroz e feijão", price: 70.00, category: "carnes" },
      { id: "c7", name: "Frango na Chapa c/ Fritas", description: "Farofa, arroz e feijão", price: 75.00, category: "carnes" },
      { id: "c8", name: "Chapa Mista", description: "Carne/Frango/Peixe/Camarão - Arroz, feijão, farofa e batata frita", price: 170.00, category: "carnes" },
    ]
  },
  {
    id: "porcoes",
    name: "Porções",
    icon: "🍚",
    items: [
      { id: "po1", name: "Arroz", description: "", price: 7.00, category: "porcoes" },
      { id: "po2", name: "Farofa", description: "", price: 7.00, category: "porcoes" },
      { id: "po3", name: "Vinagrete", description: "", price: 7.00, category: "porcoes" },
      { id: "po4", name: "Feijão", description: "", price: 7.00, category: "porcoes" },
    ]
  },
  {
    id: "tiragosto",
    name: "Tira Gosto",
    icon: "🍤",
    items: [
      { id: "t1", name: "Macaxeira", description: "Molho rosê", price: 30.00, category: "tiragosto" },
      { id: "t2", name: "Batata Frita", description: "Molho rosê", price: 30.00, category: "tiragosto" },
      { id: "t3", name: "Calabresa", description: "Com farofa", price: 50.00, category: "tiragosto" },
      { id: "t4", name: "Filé a Palito", description: "Com farofa", price: 100.00, category: "tiragosto" },
    ]
  },
  {
    id: "bebidas",
    name: "Bebidas",
    icon: "🍺",
    items: [
      { id: "b1", name: "Skol 600ml", description: "", price: 13.00, category: "bebidas" },
      { id: "b2", name: "Brahma 600ml", description: "", price: 13.00, category: "bebidas" },
      { id: "b3", name: "Tijuca 600ml", description: "", price: 13.00, category: "bebidas" },
      { id: "b4", name: "Cerveja Long Neck", description: "", price: 15.00, category: "bebidas" },
      { id: "b5", name: "Lata", description: "", price: 7.00, category: "bebidas" },
      { id: "b6", name: "Refrigerante 1L", description: "", price: 10.00, category: "bebidas" },
      { id: "b7", name: "Cola-Cola 2L", description: "", price: 18.00, category: "bebidas" },
      { id: "b8", name: "Guaraná 2L", description: "", price: 18.00, category: "bebidas" },
      { id: "b9", name: "Água 350ml", description: "", price: 3.00, category: "bebidas" },
      { id: "b10", name: "Água 500ml", description: "", price: 5.00, category: "bebidas" },
      { id: "b11", name: "Água 1,5L", description: "", price: 10.00, category: "bebidas" },
    ]
  }
];
