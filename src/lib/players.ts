import { supabase } from '@/lib/supabase';

// Возвращает id текущего пользователя; если ещё не входили, входит анонимно
export async function ensureUserId(): Promise<string> {
    const { data } = await supabase.auth.getSession();
    if (data.session) return data.session.user.id;

    const { data: signIn, error } = await supabase.auth.signInAnonymously();
    if (error || !signIn.user) throw error ?? new Error('Не удалось войти');
    return signIn.user.id;
}

// Отправляет имя и уровень на сервер (создаёт или обновляет свою строку)
export async function syncProfile(name: string, levelIndex: number) {
    const id = await ensureUserId();
    const { error } = await supabase.from('players').upsert({
        id,
        name: name.trim(),
        level_index: levelIndex,
        updated_at: new Date().toISOString(),
    });
    if (error) throw error;
}