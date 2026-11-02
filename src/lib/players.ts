import { supabase } from '@/lib/supabase';

// Возвращает id текущего пользователя; если ещё не входили, входит анонимно
export async function ensureUserId(): Promise<string> {
    const { data } = await supabase.auth.getSession();
    if (data.session) return data.session.user.id;

    const { data: signIn, error } = await supabase.auth.signInAnonymously();
    if (error || !signIn.user) throw error ?? new Error('Не удалось войти');
    return signIn.user.id;
}

// Отправляет имя и оба уровня на сервер (создаёт или обновляет свою строку)
export async function syncProfile(name: string, levelIndex: number, daoLevelIndex: number) {
    const id = await ensureUserId();
    const { error } = await supabase.from('players').upsert({
        id,
        name: name.trim(),
        level_index: levelIndex,
        dao_level_index: daoLevelIndex,
        updated_at: new Date().toISOString(),
    });
    if (error) throw error;
}

export type PlayerRow = { id: string; name: string; level_index: number };

// Загружает всех игроков с именем: сначала самые высокие уровни
export async function fetchPlayers(): Promise<{ players: PlayerRow[]; myId: string }> {
    const myId = await ensureUserId();

    const { data, error } = await supabase
        .from('players')
        .select('id, name, level_index')
        .neq('name', '')
        .order('level_index', { ascending: false })
        .order('name', { ascending: true })
        .limit(100);
    if (error) throw error;

    return { players: (data ?? []) as PlayerRow[], myId };
}