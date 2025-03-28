const products = [
  {
    title: "Computadora Gamer RTX",
    description: "Computadora gamer con procesador i9 y RTX 4080",
    code: "CG001",
    price: 2500,
    status: true,
    stock: 5,
    category: "Compusgamers",
    thumbnails: ["computadora-gamer.jpg"]
  },
  {
    title: "Teclado Mecánico RGB",
    description: "Teclado gaming con switches Cherry MX",
    code: "TM001",
    price: 120,
    status: true,
    stock: 15,
    category: "Periféricos",
    thumbnails: ["teclado-mecanico.jpg"]
  },
  {
    title: "Mouse Gaming",
    description: "Mouse gaming 16000 DPI con RGB",
    code: "MG001",
    price: 80,
    status: true,
    stock: 20,
    category: "Periféricos",
    thumbnails: ["/images/mouse-gaming.jpg"]
  }
];

module.exports = products;