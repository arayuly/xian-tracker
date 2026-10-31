import { Screen } from '@/components/Screen';
import { LEVELS } from '@/constants/levels';
import { colors, fonts } from '@/constants/xian';
import { usePlayer } from '@/state/player';
import { StyleSheet, Text, TextInput, View } from 'react-native';

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <View style={styles.stat}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

export default function ProfileScreen() {
    const { name, setName, levelIndex, totalPushups, totalPages } = usePlayer();
    const level = LEVELS[levelIndex];
    const displayName = name.trim() || 'Безымянный';

    return (
        <Screen seal="我" title="Профиль">
            <View style={styles.content}>
                <View style={styles.field}>
                    <Text style={styles.label}>Имя</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Как тебя зовут, культиватор?"
                        placeholderTextColor={colors.inkSoft}
                        maxLength={24}
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Так тебя увидят другие</Text>
                    <Text style={styles.previewName}>{displayName}</Text>
                    <Text style={styles.previewLevel}>
                        {level.realm} · {level.stage}
                    </Text>
                </View>

                <View style={styles.stats}>
                    <Stat label="Отжиманий всего" value={totalPushups} />
                    <Stat label="Страниц всего" value={totalPages} />
                </View>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    content: { gap: 28 },
    field: { gap: 6 },
    label: { fontSize: 13, letterSpacing: 1, color: colors.inkSoft, fontFamily: fonts.serif },
    input: {
        fontSize: 20,
        paddingVertical: 6,
        color: colors.ink,
        fontFamily: fonts.serif,
        borderBottomWidth: 1,
        borderBottomColor: colors.ink,
    },
    card: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.inkSoft,
        borderRadius: 6,
        padding: 18,
        gap: 6,
    },
    previewName: { fontSize: 22, color: colors.ink, fontFamily: fonts.serif },
    previewLevel: { fontSize: 15, color: colors.seal, fontFamily: fonts.serif },
    stats: { flexDirection: 'row', gap: 32 },
    stat: { gap: 4 },
    statValue: { fontSize: 28, color: colors.ink, fontFamily: fonts.serif },
});