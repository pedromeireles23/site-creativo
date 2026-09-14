export type MenuKey = 'index' | 'animals' | 'flora';

export type Chapter = {
  id: string;
  number: string;
  label: string;
  note: string;
};

export type MenuEntry = {
  id: string;
  number: string;
  label: string;
  note: string;
  scientificName?: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  destination: string;
  hideDestinationLink?: boolean;
};

export type MenuGroup = {
  label: string;
  navigationLabel?: string;
  eyebrow: string;
  description: string;
  entries: MenuEntry[];
};

export const chapters: Chapter[] = [
  {
    id: 'despertar',
    number: '01',
    label: 'Despertar',
    note: 'O primeiro fôlego',
  },
  { id: 'folego', number: '02', label: 'Fôlego', note: 'A mata respira' },
  { id: 'veias', number: '03', label: 'Veias', note: 'A água em movimento' },
  { id: 'camadas', number: '04', label: 'Camadas', note: 'Nada vive sozinho' },
  {
    id: 'territorios',
    number: '05',
    label: 'Territórios',
    note: 'A floresta não é uma só',
  },
  { id: 'olhos', number: '06', label: 'Olhos', note: 'A presença da onça' },
  {
    id: 'documentario',
    number: '07',
    label: 'Documentário',
    note: 'Assista à travessia',
  },
];

export const menuGroups: Record<Exclude<MenuKey, 'index'>, MenuGroup> = {
  animals: {
    label: 'Animais',
    navigationLabel: 'Fauna',
    eyebrow: 'Fauna amazônica',
    description: 'Encontros entre o rio, o chão e a copa.',
    entries: [
      {
        id: 'ariranha',
        number: '01',
        label: 'Ariranha',
        note: 'A corrente se move em família',
        scientificName: 'Pteronura brasiliensis',
        image: '/images/fauna/ariranha-amazonia.png',
        imageAlt: 'Ariranha em um rio da floresta amazônica',
        destination: 'camadas',
      },
      {
        id: 'anta',
        number: '02',
        label: 'Anta',
        note: 'Cada passo espalha uma nova floresta',
        scientificName: 'Tapirus terrestris',
        image: '/images/fauna/anta-amazonia.png',
        imageAlt: 'Anta caminhando pela floresta amazônica',
        imagePosition: '52% center',
        destination: 'camadas',
      },
      {
        id: 'jaguatirica',
        number: '03',
        label: 'Jaguatirica',
        note: 'A sombra também aprendeu a enxergar',
        scientificName: 'Leopardus pardalis',
        image: '/images/fauna/jaguatirica-amazonia.png',
        imageAlt: 'Jaguatirica entre a vegetação da Amazônia',
        destination: 'camadas',
      },
      {
        id: 'macaco-aranha',
        number: '04',
        label: 'Macaco-aranha',
        note: 'Entre galhos, nenhuma árvore está sozinha',
        scientificName: 'Ateles paniscus',
        image: '/images/fauna/macaco-aranha-amazonia.png',
        imageAlt: 'Macaco-aranha na copa da floresta amazônica',
        destination: 'camadas',
      },
      {
        id: 'harpia',
        number: '05',
        label: 'Harpia',
        note: 'Do alto, a floresta revela sua escala',
        scientificName: 'Harpia harpyja',
        image: '/images/fauna/harpia-amazonia.png',
        imageAlt: 'Harpia pousada no alto da floresta amazônica',
        imagePosition: 'center 24%',
        destination: 'camadas',
      },
      {
        id: 'onca-pintada',
        number: '06',
        label: 'Onça-pintada',
        note: 'Uma presença que a mata quase esconde',
        scientificName: 'Panthera onca',
        image: '/images/jaguar/jaguar-eyes-amazon.png',
        imageAlt: 'Onça-pintada parcialmente oculta na floresta amazônica',
        imagePosition: '64% center',
        destination: 'camadas',
        hideDestinationLink: true,
      },
    ],
  },
  flora: {
    label: 'Flora',
    eyebrow: 'Paisagens vivas',
    description: 'A floresta muda quando a água e a altitude mudam.',
    entries: [
      {
        id: 'terra-firme',
        number: '01',
        label: 'Terra firme',
        note: 'Árvores altas sobre o chão não inundável',
        image: '/images/territorios/terra-firme.png',
        imageAlt: 'Árvores altas em uma floresta amazônica de terra firme',
        destination: 'territorios',
      },
      {
        id: 'varzea',
        number: '02',
        label: 'Várzea',
        note: 'A cheia redesenha a vegetação a cada ciclo',
        image: '/images/territorios/varzea.png',
        imageAlt: 'Vegetação de várzea na floresta amazônica',
        destination: 'territorios',
      },
      {
        id: 'igapo',
        number: '03',
        label: 'Igapó',
        note: 'Raízes e troncos habitam as águas escuras',
        image: '/images/territorios/igapo.png',
        imageAlt: 'Floresta de igapó refletida nas águas escuras',
        destination: 'territorios',
      },
      {
        id: 'copa-amazonica',
        number: '04',
        label: 'Copa amazônica',
        note: 'Um horizonte contínuo de folhas e luz',
        image: '/images/territorios/territorios-abertura.png',
        imageAlt: 'Vista aérea da copa da floresta amazônica',
        destination: 'territorios',
      },
    ],
  },
};
