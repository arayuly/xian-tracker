import { Screen } from '@/components/Screen';
import { LEVELS } from '@/constants/levels';
import { colors, fonts } from '@/constants/xian';
import { fetchPlayers, PlayerRow } from '@/lib/players';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

function Separator() {
    return <View style={styles.separator} />;
}

export default function CultivatorsScreen() {
    const [players, setPlayers] = useState<PlayerRow[]>([]);
    const [myId, setMyId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // первая загрузка
    const [refreshing, setRefreshing] = useState(false); // обновление свайпом
    const [failed, setFailed] = useState(false);

    const load = useCallback(async () => {
        try {
            const result = await fetchPlayers();
            setPlayers(result.players);
            setMyId(result.myId);
            setFailed(false);
        } catch (e) {
            console.log('fetch error:', e);
            setFailed(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Загружаем список при каждом открытии вкладки
    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    function handleRefresh() {
        setRefreshing(true);
        load();
    }

    return (
        <Screen seal="宗" title="Культиваторы">
            {loading ? (
                <ActivityIndicator color={colors.seal} />
            ) : (
                <FlatList
                    data={players}
                    keyExtractor={(p) => p.id}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ItemSeparatorComponent={Separator}
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            {failed
                                ? 'Не удалось загрузить список. Потяни вниз, чтобы повторить.'
                                : 'Пока никого нет. Введи имя в профиле, и ты появишься здесь.'}
                        </Text>
                    }
                    renderItem={({ item }) => {
                        const level = LEVELS[Math.min(item.level_index, LEVELS.length - 1)];
                        const isMe = item.id === myId;
                        return (
                            <View style={styles.row}>
                                <Text style={styles.name}>
                                    {item.name}
                                    {isMe && <Text style={styles.you}> (ты)</Text>}
                                </Text>
                                <Text style={styles.level}>
                                    {level.realm} · {level.stage}
                                </Text>
                            </View>
                        );
                    }}
                />
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    row: { paddingVertical: 14, gap: 4 },
    name: { fontSize: 20, color: colors.ink, fontFamily: fonts.serif },
    you: { fontSize: 14, color: colors.inkSoft },
    level: { fontSize: 14, color: colors.seal, fontFamily: fonts.serif },
    separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
    empty: { fontSize: 15, color: colors.inkSoft, fontFamily: fonts.serif },
});