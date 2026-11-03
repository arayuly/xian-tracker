import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

// При сборке проекта код один раз запускается в Node.js: там нет `window`,
// и читать хранилище нельзя. На телефоне `window` есть.
const isServer = typeof window === 'undefined';

export const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '',
    {
        auth: {
            storage: isServer ? undefined : AsyncStorage, // здесь хранится «вход» между запусками
            autoRefreshToken: !isServer,
            persistSession: !isServer,
            detectSessionInUrl: false,
        },
    },
);

// Обновляем токен только пока приложение открыто
if (!isServer) {
    AppState.addEventListener('change', (state) => {
        if (state === 'active') supabase.auth.startAutoRefresh();
        else supabase.auth.stopAutoRefresh();
    });
}