const DESTINOS_COLOMBIA = [
  {
    id: "cartagena",
    lugar: "Cartagena",
    departamento: "Bolivar",
    precio: "$720.000",
    img: "https://res.cloudinary.com/dtsialzm5/image/upload/v1778685890/cartagena_qwu4py.jpg",
    icono: "fas fa-umbrella-beach",
    descripcion: "Ciudad amurallada, playas cercanas, historia colonial y vida nocturna frente al Caribe.",
    clima: "Calido",
    duracion: "3 dias / 2 noches",
    ideal: "Parejas, familias y viajeros culturales",
    actividades: ["Ciudad Amurallada", "Islas del Rosario", "Castillo de San Felipe"],
  },
  {
    id: "medellin",
    lugar: "Medellin",
    departamento: "Antioquia",
    precio: "$520.000",
    img: "https://res.cloudinary.com/dtsialzm5/image/upload/v1778685890/Medellin_e7dc59.jpg",
    icono: "fas fa-city",
    descripcion: "Innovacion urbana, miradores, cultura paisa y escapadas a pueblos coloridos como Guatape.",
    clima: "Templado",
    duracion: "3 dias / 2 noches",
    ideal: "Amigos, familias y turismo urbano",
    actividades: ["Comuna 13", "Pueblito Paisa", "Guatape y Piedra del Penol"],
  },
  {
    id: "eje-cafetero",
    lugar: "Eje Cafetero",
    departamento: "Quindio, Risaralda y Caldas",
    precio: "$680.000",
    img: "https://res.cloudinary.com/dtsialzm5/image/upload/v1778685890/Eje_cafeter_mppyaf.jpg",
    icono: "fas fa-mug-hot",
    descripcion: "Paisajes cafeteros, fincas tradicionales, parques tematicos y montanas verdes.",
    clima: "Templado",
    duracion: "4 dias / 3 noches",
    ideal: "Familias y amantes de la naturaleza",
    actividades: ["Valle del Cocora", "Salento", "Tour cafetero"],
  },
  {
    id: "santa-marta",
    lugar: "Santa Marta",
    departamento: "Magdalena",
    precio: "$760.000",
    img: "https://res.cloudinary.com/dtsialzm5/image/upload/v1778685890/Santa_Marta_fwvtmd.jpg",
    icono: "fas fa-water",
    descripcion: "Playas, sierra, bahias naturales y entrada a uno de los parques mas famosos del pais.",
    clima: "Calido",
    duracion: "4 dias / 3 noches",
    ideal: "Aventura, playa y ecoturismo",
    actividades: ["Parque Tayrona", "Taganga", "Minca"],
  },
  {
    id: "san-andres",
    lugar: "San Andres",
    departamento: "Archipielago de San Andres",
    precio: "$1.050.000",
    img: "https://res.cloudinary.com/dtsialzm5/image/upload/v1778685948/playa-san-andres_vokten.jpg",
    icono: "fas fa-fish",
    descripcion: "Mar de siete colores, playas de arena blanca, snorkel y ambiente caribeno.",
    clima: "Calido",
    duracion: "4 dias / 3 noches",
    ideal: "Playa, descanso y deportes acuaticos",
    actividades: ["Johnny Cay", "Acuario", "Vuelta a la isla"],
  },
  {
    id: "villa-de-leyva",
    lugar: "Villa de Leyva",
    departamento: "Boyaca",
    precio: "$390.000",
    img: "https://res.cloudinary.com/dtsialzm5/image/upload/v1778685890/Villa_de_Leyva_sw9knd.jpg",
    icono: "fas fa-landmark",
    descripcion: "Arquitectura colonial, calles empedradas, fosiles, museos y paisajes semideserticos.",
    clima: "Templado/frio",
    duracion: "2 dias / 1 noche",
    ideal: "Escapadas romanticas y turismo historico",
    actividades: ["Plaza Mayor", "Pozos Azules", "Museo El Fosil"],
  },
];

function obtenerDestinosColombia() {
  const destinosAdmin = JSON.parse(localStorage.getItem("destinosAdmin")) || [];
  return [...DESTINOS_COLOMBIA, ...destinosAdmin];
}

function buscarDestinoColombia(id) {
  return obtenerDestinosColombia().find(destino => destino.id === id);
}