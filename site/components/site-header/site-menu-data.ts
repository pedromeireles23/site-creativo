export type MenuKey = 'index' | 'bioma' | 'vida' | 'travessia';

export type Chapter = {
  id: string;
  number: string;
  label: string;
  note: string;
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

export const menuGroups: Record<
  Exclude<MenuKey, 'index'>,
  { label: string; eyebrow: string; chapters: string[] }
> = {
  bioma: {
    label: 'Bioma',
    eyebrow: 'A floresta',
    chapters: ['despertar', 'folego', 'veias', 'camadas', 'territorios'],
  },
  vida: {
    label: 'Vida',
    eyebrow: 'Presenças',
    chapters: ['olhos'],
  },
  travessia: {
    label: 'Travessia',
    eyebrow: 'Um só corpo',
    chapters: ['documentario'],
  },
};
