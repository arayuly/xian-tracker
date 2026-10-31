export type Level = {
    realm: string;
    hanzi?: string;
    stage: string;
    pushups: number; // сколько нужно для прорыва на следующий уровень
    pages: number;
};

// Формулы сложности: n — номер уровня (1, 2, 3 ...)
const pushupsFor = (n: number) => 30 + 10 * n;
const pagesFor = (n: number) => 10 + 5 * n;

const LAYERS_15 = Array.from({ length: 15 }, (_, i) => `${i + 1}-й слой`);
const STAGES_4 = ['Ранняя стадия', 'Средняя стадия', 'Поздняя стадия', 'Пик'];

const REALMS = [
    { name: 'Конденсация Ци', hanzi: '凝气', stages: LAYERS_15 },
    { name: 'Закладка Фундамента', hanzi: '筑基', stages: STAGES_4 },
    { name: 'Формирование Ядра', hanzi: '结丹', stages: STAGES_4 },
    { name: 'Зарождающаяся Душа', hanzi: '元婴', stages: STAGES_4 },
    { name: 'Формирование Души', hanzi: '化神', stages: STAGES_4 },
    { name: 'Трансформация Души', hanzi: undefined, stages: STAGES_4 },
    { name: 'Вознесение', hanzi: '问鼎', stages: STAGES_4 },
];

export const LEVELS: Level[] = REALMS.flatMap((realm) =>
    realm.stages.map((stage) => ({ realm: realm.name, hanzi: realm.hanzi, stage })),
).map((base, i) => ({
    ...base,
    pushups: pushupsFor(i + 1),
    pages: pagesFor(i + 1),
}));