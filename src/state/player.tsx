import { LEVELS } from '@/constants/levels';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'xian-player-v1';

type SavedData = {
    name: string;
    levelIndex: number;
    pushups: number; // прогресс на текущем уровне
    pages: number;
    totalPushups: number; // за всё время
    totalPages: number;
};

type PlayerContextValue = SavedData & {
    setName: (name: string) => void;
    addPushups: (n: number) => void;
    addPages: (n: number) => void;
    breakthrough: () => void;
};

const DEFAULT_DATA: SavedData = {
    name: '',
    levelIndex: 0,
    pushups: 0,
    pages: 0,
    totalPushups: 0,
    totalPages: 0,
};

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
                    levelIndex: Math.min(saved.levelIndex ?? 0, LEVELS.length - 1),
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

    if (!loaded) return null;

    const value: PlayerContextValue = {
        ...data,
        setName: (name) => setData((d) => ({ ...d, name })),
        addPushups: (n) =>
            setData((d) => ({ ...d, pushups: d.pushups + n, totalPushups: d.totalPushups + n })),
        addPages: (n) =>
            setData((d) => ({ ...d, pages: d.pages + n, totalPages: d.totalPages + n })),
        breakthrough: () =>
            setData((d) => {
                const level = LEVELS[d.levelIndex];
                const isMax = d.levelIndex >= LEVELS.length - 1;
                if (isMax || d.pushups < level.pushups || d.pages < level.pages) return d;
                return {
                    ...d,
                    levelIndex: d.levelIndex + 1,
                    pushups: d.pushups - level.pushups,
                    pages: d.pages - level.pages,
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