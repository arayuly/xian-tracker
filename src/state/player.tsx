import { LEVELS } from '@/constants/levels';
import { syncProfile } from '@/lib/players';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'xian-player-v1';

type SavedData = {
    name: string;
    levelIndex: number; // уровень культивации (отжимания)
    daoLevelIndex: number; // уровень Дао (чтение)
    pushups: number; // прогресс отжиманий на текущем уровне
    pages: number; // прогресс чтения на текущем уровне Дао
    totalPushups: number;
    totalPages: number;
    lastPushups: number; // последняя запись отжиманий (для отмены), 0 если отменять нечего
    lastPages: number; // последняя запись страниц
};

type PlayerContextValue = SavedData & {
    setName: (name: string) => void;
    addPushups: (n: number) => void;
    addPages: (n: number) => void;
    undoPushups: () => void;
    undoPages: () => void;
    breakthroughBody: () => void;
    breakthroughDao: () => void;
};

const DEFAULT_DATA: SavedData = {
    name: '',
    levelIndex: 0,
    daoLevelIndex: 0,
    pushups: 0,
    pages: 0,
    totalPushups: 0,
    totalPages: 0,
    lastPushups: 0,
    lastPages: 0,
};

// Защита от неверных чисел в сохранённых данных
function clampLevel(value: unknown) {
    const n = Number(value) || 0;
    return Math.min(Math.max(n, 0), LEVELS.length - 1);
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<SavedData>(DEFAULT_DATA);
    const [loaded, setLoaded] = useState(false);

    // 1. При запуске читаем сохранённое
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((json) => {
                if (!json) return;
                const saved = JSON.parse(json);
                setData({
                    ...DEFAULT_DATA,
                    ...saved,
                    levelIndex: clampLevel(saved.levelIndex),
                    daoLevelIndex: clampLevel(saved.daoLevelIndex),
                });
            })
            .catch(() => { })
            .finally(() => setLoaded(true));
    }, []);

    // 2. При каждом изменении сохраняем (но только после первой загрузки)
    useEffect(() => {
        if (!loaded) return;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => { });
    }, [data, loaded]);

    // 3. Отправляем имя и оба уровня на сервер (через 1 секунду после последнего изменения)
    useEffect(() => {
        if (!loaded || !data.name.trim()) return;
        const timer = setTimeout(() => {
            syncProfile(data.name, data.levelIndex, data.daoLevelIndex).catch((e) =>
                console.log('sync error:', e),
            );
        }, 1000);
        return () => clearTimeout(timer);
    }, [loaded, data.name, data.levelIndex, data.daoLevelIndex]);

    if (!loaded) return null;

    const value: PlayerContextValue = {
        ...data,
        setName: (name) => setData((d) => ({ ...d, name })),

        addPushups: (n) =>
            setData((d) => ({
                ...d,
                pushups: d.pushups + n,
                totalPushups: d.totalPushups + n,
                lastPushups: n,
            })),
        addPages: (n) =>
            setData((d) => ({
                ...d,
                pages: d.pages + n,
                totalPages: d.totalPages + n,
                lastPages: n,
            })),

        undoPushups: () =>
            setData((d) => ({
                ...d,
                pushups: Math.max(0, d.pushups - d.lastPushups),
                totalPushups: Math.max(0, d.totalPushups - d.lastPushups),
                lastPushups: 0,
            })),
        undoPages: () =>
            setData((d) => ({
                ...d,
                pages: Math.max(0, d.pages - d.lastPages),
                totalPages: Math.max(0, d.totalPages - d.lastPages),
                lastPages: 0,
            })),

        breakthroughBody: () =>
            setData((d) => {
                const level = LEVELS[d.levelIndex];
                const isMax = d.levelIndex >= LEVELS.length - 1;
                if (isMax || d.pushups < level.pushups) return d;
                return {
                    ...d,
                    levelIndex: d.levelIndex + 1,
                    pushups: d.pushups - level.pushups,
                    lastPushups: 0,
                };
            }),
        breakthroughDao: () =>
            setData((d) => {
                const level = LEVELS[d.daoLevelIndex];
                const isMax = d.daoLevelIndex >= LEVELS.length - 1;
                if (isMax || d.pages < level.pages) return d;
                return {
                    ...d,
                    daoLevelIndex: d.daoLevelIndex + 1,
                    pages: d.pages - level.pages,
                    lastPages: 0,
                };
            }),
    };

    return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error('usePlayer нужно вызывать внутри PlayerProvider');
    return ctx;
}