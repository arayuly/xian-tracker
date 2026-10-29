import { Platform } from 'react-native';

export const colors = {
    paper: '#F4EFE6',   // рисовая бумага (фон)
    ink: '#1C1C1C',     // тушь (основной текст)
    inkSoft: '#6B6558', // приглушённый текст
    line: '#D9D1C2',    // тонкие линии
    seal: '#B8322A',    // киноварь (красная печать)
};

export const fonts = {
    serif: Platform.select({ ios: 'Georgia', default: 'serif' }),
};