export const WHATSAPP_NUMBER = "5511983489448";
export const WHATSAPP_DISPLAY = "(11) 98348-9448";
const WHATSAPP_GREETING = "Oii, quero saber mais sobre seu trabalho!";

/** Direct wa.me link — opens the WhatsApp chat with an optional pre-filled message. */
export function whatsappUrl(message = WHATSAPP_GREETING) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const CONTACT_URL = whatsappUrl();
export const INSTAGRAM_URL = "https://www.instagram.com/adrianaaraujo.fisio/";
export const INSTAGRAM_HANDLE = "@adrianaaraujo.fisio";

export const NAV = [
  { id: "sobre", label: "Sobre", hint: "Quem cuida", img: "img/adriana.webp" },
  { id: "tratamentos", label: "Tratamentos", hint: "10 especialidades", img: "img/eletro-ventosa.webp" },
  { id: "onde-doi", label: "Onde dói", hint: "Mapa do corpo", img: "img/acupuntura.webp" },
  { id: "jornada", label: "Jornada", hint: "Do primeiro contato à alta", img: "img/pedras-coluna.webp" },
  { id: "avaliacoes", label: "Avaliações", hint: "Quem já passou pela maca", img: "img/limpeza-pele.webp" },
  { id: "localizacao", label: "Onde estamos", hint: "Jardim Paulista · SP", img: "img/pedras-hd.webp" },
  { id: "contato", label: "Contato", hint: "Agende sua avaliação", img: "img/ventosa-costas.webp" },
];

/** Story highlights from the Instagram profile become the specialty cards. */
export const SPECIALTIES = [
  {
    title: "Fisioterapia",
    tag: "Movimento",
    text: "Avaliação postural, terapia manual e exercícios para devolver função e autonomia.",
  },
  {
    title: "Pré e pós-operatório",
    tag: "Recuperação",
    text: "Preparo antes da cirurgia e reabilitação depois dela, com drenagem e controle de edema.",
  },
  {
    title: "Acupuntura",
    tag: "Pós-graduação",
    text: "Agulhas finíssimas em pontos estratégicos para dor, ansiedade e equilíbrio energético.",
  },
  {
    title: "Ventosaterapia",
    tag: "Liberação",
    text: "Sucção controlada que libera fáscia, ativa a circulação e alivia contraturas.",
  },
  {
    title: "Pedras quentes",
    tag: "Relaxamento",
    text: "Basalto aquecido ao longo da coluna: calor profundo que desfaz a tensão acumulada.",
  },
  {
    title: "MES",
    tag: "Habilitada",
    text: "Microcorrentes e eletroestimulação para analgesia e regeneração dos tecidos.",
  },
  {
    title: "Heccus",
    tag: "Estética",
    text: "Ultrassom e corrente aussie para gordura localizada, celulite e flacidez.",
  },
  {
    title: "Limpeza de pele",
    tag: "Estética",
    text: "Higienização profunda, extração cuidadosa e hidratação para uma pele que respira.",
  },
  {
    title: "Massagens",
    tag: "Bem-estar",
    text: "Relaxante, modeladora ou terapêutica: toque técnico ajustado ao seu momento.",
  },
  {
    title: "Crianças",
    tag: "Família",
    text: "Atendimento lúdico e acolhedor para os pequenos, com a família por perto.",
  },
];

/** Body regions for the pinned "onde dói" list. `range` selects vertebrae on the 3D spine. */
export const REGIONS = [
  {
    name: "Cervical",
    range: [0, 6] as [number, number],
    title: "Pescoço travado, dor de cabeça tensional",
    text: "Terapia manual, acupuntura e ventosas na musculatura do trapézio para soltar o que o dia apertou.",
    tools: ["Acupuntura", "Ventosa", "Terapia manual"],
  },
  {
    name: "Torácica",
    range: [7, 13] as [number, number],
    title: "Postura, respiração e costas pesadas",
    text: "Mobilidade da coluna torácica e liberação miofascial para abrir o peito e respirar melhor.",
    tools: ["Pedras quentes", "Mobilização", "Exercícios"],
  },
  {
    name: "Lombar",
    range: [14, 18] as [number, number],
    title: "Lombalgia e crises de dor",
    text: "Analgesia com eletroestimulação, ventosas e fortalecimento do core para não voltar.",
    tools: ["MES", "Ventosa", "Core"],
  },
  {
    name: "Sacral",
    range: [19, 21] as [number, number],
    title: "Ciático, quadril e pelve",
    text: "Avaliação da cadeia posterior e acupuntura para aliviar a irradiação para as pernas.",
    tools: ["Acupuntura", "Alongamento", "Calor"],
  },
  {
    name: "Pós-op",
    range: [0, 21] as [number, number],
    title: "Recuperação depois da cirurgia",
    text: "Drenagem, controle de edema e retorno gradual ao movimento, do primeiro dia até a alta.",
    tools: ["Drenagem", "Cicatriz", "Reabilitação"],
  },
];

export const JOURNEY = [
  {
    step: "01",
    title: "Escuta e avaliação",
    text: "Uma conversa sem pressa sobre a sua história, seguida de avaliação física completa.",
    img: "img/adriana.webp",
    color: "#e8cfc7",
  },
  {
    step: "02",
    title: "Plano sob medida",
    text: "Técnicas combinadas para o seu objetivo: dor, recuperação, estética ou bem-estar.",
    img: "img/acupuntura.webp",
    color: "#e4d8c8",
  },
  {
    step: "03",
    title: "Sessões que somam",
    text: "Fisioterapia, acupuntura, ventosas e calor trabalhando juntos, sessão a sessão.",
    img: "img/eletro-ventosa.webp",
    color: "#c9b59c",
  },
  {
    step: "04",
    title: "Autonomia e alta",
    text: "Você sai com exercícios, orientação e um corpo que voltou a ser seu.",
    img: "img/pedras-sala.webp",
    color: "#b5bfa8",
  },
];

export const FAQ = [
  {
    q: "Preciso de encaminhamento médico?",
    a: "Não. A fisioterapeuta faz a avaliação inicial e indica o melhor caminho. Se você tiver exames ou laudos, traga para a primeira consulta.",
  },
  {
    q: "Acupuntura dói?",
    a: "As agulhas são finíssimas e descartáveis. A maioria das pessoas sente apenas uma leve pressão e relaxa durante a sessão.",
  },
  {
    q: "Quando começar o pós-operatório?",
    a: "Na maioria das cirurgias, já nos primeiros dias, com liberação do seu cirurgião. Quanto antes, melhor o controle do edema.",
  },
  {
    q: "As marcas da ventosa são normais?",
    a: "Sim. São sinais de circulação ativada e somem em poucos dias. Não são hematomas de impacto e não costumam doer.",
  },
  {
    q: "Atende crianças e família?",
    a: "Sim. O atendimento infantil é lúdico e acolhedor, e a família pode acompanhar a sessão.",
  },
];

export const CHIPS = [
  "Lombalgia",
  "Cervicalgia",
  "Pós-cirúrgico",
  "Ansiedade",
  "Drenagem",
  "Contraturas",
  "Ciatalgia",
  "Tensão muscular",
  "Cefaleia",
  "Edema",
  "Celulite",
  "Flacidez",
  "Insônia",
  "Postura",
  "Fibromialgia",
  "Bursite",
];

/** Real reviews, copied verbatim from Adriana's previous site (adrianaaraujo.framer.website). */
export const TESTIMONIALS = [
  {
    name: "Luciana Veloso B.",
    tag: "Paciente desde 2008",
    text: "Adriana é uma fisioterapeuta maravilhosa. Sou cliente dela desde o ano de 2008. Ela é uma excelente massoterapeuta (massagista) e acupunturista. Domina várias técnicas de massagem e no que diz respeito à Medicina Chinesa também faz ventosaterapia, moxabustão, auriculoterapia, além da acupuntura tradicional com agulhas. Trata-se de uma pessoa muito competente, responsável e pontual. Uma profissional que indico para todas as pessoas que conheço.",
  },
  {
    name: "Rosangela Ribeiro",
    tag: "Pós-operatório",
    text: "Profissional sensacional. Tive o prazer da Adriana cuidar do meu pós operatório e sem dúvidas se não fosse ela, teria sido muito mais difícil. Super indico e indicaria mil vezes!!!!",
  },
  {
    name: "Tatiana Santos",
    tag: "Estética facial",
    text: "Atendimento excelente, muito acima da média, o procedimento foi realizado conforme a necessidade da minha pele, super profissional, não arrisco outros lugares, sem dúvidas a melhor, super indico.",
  },
  {
    name: "Patricia Spinola",
    tag: "Paciente",
    text: "Adriana maravilhosa!! Só tenho elogios: excelente profissional, super capacitada e dedicada. Eternamente bem humorada. Ela é nota 1000 👏🏻👏🏻👏🏻",
  },
  {
    name: "Ruth Marques",
    tag: "Paciente",
    text: "Amei ser cuidada pela Dri, muito atenciosa, competente e de um profissionalismo exemplar. Fui atendida na clínica mas descobri que ela atende em domicílio então na próxima não sei onde vou agendar. Amei!",
  },
  {
    name: "Milena Sena",
    tag: "Estética",
    text: "Um lugar lindo, cheiroso e agradável! Contando com uma profissional incrível, que traz técnicas que ajudam muito na autoestima, eu amei e amo ♥️",
  },
];

export const ADDRESS = {
  street: "Av. Nove de Julho, 3229",
  unit: "Conj. 1009",
  district: "Jardim Paulista",
  city: "São Paulo — SP",
  zip: "01407-000",
  /** Single-line form used for map queries. */
  query: "Av. Nove de Julho, 3229 - Jardim Paulista, São Paulo - SP, 01407-000",
};

export const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS.query)}&z=16&output=embed`;
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS.query)}`;
export const WAZE_URL = `https://waze.com/ul?q=${encodeURIComponent(ADDRESS.query)}&navigate=yes`;
