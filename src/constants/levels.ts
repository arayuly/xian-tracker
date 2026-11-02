export type Level = {
    step: string; // «Первый шаг»
    realm: string;
    hanzi?: string;
    stage: string;
    pushups: number; // сколько нужно для прорыва на следующий уровень
    pages: number;
};

// Формулы сложности: n — номер уровня (1, 2, 3 ...)
const pushupsFor = (n: number) => 30 + 10 * n;
const pagesFor = (n: number) => 10 + 5 * n;

// Варианты стадий
const LAYERS_15 = Array.from({ length: 15 }, (_, i) => `${i + 1}-й слой`);
const STAGES_3 = ['Ранняя стадия', 'Средняя стадия', 'Поздняя стадия'];
const STAGES_4 = ['Ранняя стадия', 'Средняя стадия', 'Поздняя стадия', 'Пик'];
const STAGES_CYCLE = ['Ранняя стадия', 'Средняя стадия', 'Поздняя стадия', 'Великий круг'];
const STAGES_ARCANE = [...STAGES_CYCLE, 'Преодоление бедствий'];
const BLIGHTS = Array.from({ length: 5 }, (_, i) => `${i + 1}-е бедствие`);
const TRANSITION = ['Переходная ступень'];

type Realm = { name: string; hanzi?: string; stages: string[] };
type Step = { name: string; realms: Realm[] };

// Чтобы добавить четвёртый шаг, допиши ещё один блок в конец этого списка
const STEPS: Step[] = [
    {
        name: 'Первый шаг',
        realms: [
            { name: 'Конденсация Ци', hanzi: '凝气', stages: LAYERS_15 },
            { name: 'Закладка Фундамента', hanzi: '筑基', stages: STAGES_3 },
            { name: 'Формирование Ядра', hanzi: '结丹', stages: STAGES_4 },
            { name: 'Зарождающаяся Душа', hanzi: '元婴', stages: STAGES_4 },
            { name: 'Формирование Души', hanzi: '化神', stages: STAGES_CYCLE },
            { name: 'Трансформация Души', hanzi: '婴变', stages: STAGES_CYCLE },
            { name: 'Вознесение', hanzi: '问鼎', stages: STAGES_CYCLE },
            { name: 'Пустота Инь', hanzi: '阴虚', stages: TRANSITION },
            { name: 'Наполнение Ян', hanzi: '阳实', stages: TRANSITION },
        ],
    },
    {
        name: 'Второй шаг',
        realms: [
            { name: 'Взирающий на Нирвану', hanzi: '窥涅', stages: STAGES_4 },
            { name: 'Очищающий Нирвану', hanzi: '净涅', stages: STAGES_4 },
            { name: 'Разбивающий Нирвану', hanzi: '碎涅', stages: STAGES_4 },
            { name: 'Небесное Бедствие', stages: BLIGHTS },
        ],
    },
    {
        name: 'Третий шаг',
        realms: [
            { name: 'Пустота Нирваны', hanzi: '空涅', stages: STAGES_4 },
            { name: 'Пустота Духа', hanzi: '空灵', stages: STAGES_4 },
            { name: 'Сокровенная Пустота', hanzi: '空玄', stages: STAGES_ARCANE },
            { name: 'Бедствие Пустоты', hanzi: '空劫', stages: STAGES_4 },
            { name: 'Полупопирание Небес', stages: TRANSITION },
        ],
    },
];

// Разворачиваем шаги → сферы → стадии в один плоский список уровней
export const LEVELS: Level[] = STEPS.flatMap((step) =>
    step.realms.flatMap((realm) =>
        realm.stages.map((stage) => ({
            step: step.name,
            realm: realm.name,
            hanzi: realm.hanzi,
            stage,
        })),
    ),
).map((base, i) => ({
    ...base,
    pushups: pushupsFor(i + 1),
    pages: pagesFor(i + 1),
}));