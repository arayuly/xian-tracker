import { colors, fonts } from '@/constants/xian';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, Vibration, View } from 'react-native';

type Props = {
    title: string;
    unit: string;
    current: number;
    goal: number;
    onAdd: (amount: number) => void;
    quickAmounts?: number[]; // быстрые кнопки, по умолчанию +5, +10, +20
};

export function ProgressCard({
    title,
    unit,
    current,
    goal,
    onAdd,
    quickAmounts = [5, 10, 20],
}: Props) {
    const [text, setText] = useState('');
    const progress = Math.min(current / goal, 1);
    const done = current >= goal;

    function handleAdd() {
        const amount = parseInt(text, 10);
        if (isNaN(amount) || amount <= 0) return;
        onAdd(amount);
        setText('');
    }

    function handleQuick(amount: number) {
        Vibration.vibrate(15); // лёгкий отклик на нажатие
        onAdd(amount);
    }

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.title}>{title}</Text>
                <Text style={[styles.count, done && styles.countDone]}>
                    {current} / {goal} {unit}
                </Text>
            </View>

            <View style={styles.track}>
                <View
                    style={[styles.fill, done && styles.fillDone, { width: `${progress * 100}%` }]}
                />
            </View>

            <View style={styles.quickRow}>
                {quickAmounts.map((amount) => (
                    <Pressable key={amount} style={styles.chip} onPress={() => handleQuick(amount)}>
                        <Text style={styles.chipText}>+{amount}</Text>
                    </Pressable>
                ))}
            </View>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    keyboardType="number-pad"
                    placeholder="Другое число"
                    placeholderTextColor={colors.inkSoft}
                    onSubmitEditing={handleAdd}
                />
                <Pressable style={styles.button} onPress={handleAdd}>
                    <Text style={styles.buttonText}>Добавить</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.inkSoft,
        borderRadius: 6,
        padding: 18,
        gap: 14,
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    title: { fontSize: 18, color: colors.ink, fontFamily: fonts.serif },
    count: { fontSize: 14, color: colors.inkSoft, fontFamily: fonts.serif },
    countDone: { color: colors.seal },
    track: { height: 4, borderRadius: 2, backgroundColor: colors.line, overflow: 'hidden' },
    fill: { height: 4, backgroundColor: colors.ink },
    fillDone: { backgroundColor: colors.seal },
    quickRow: { flexDirection: 'row', gap: 10 },
    chip: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.inkSoft,
        borderRadius: 4,
    },
    chipText: { fontSize: 16, color: colors.ink, fontFamily: fonts.serif },
    inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
    input: {
        flex: 1,
        fontSize: 18,
        paddingVertical: 6,
        color: colors.ink,
        fontFamily: fonts.serif,
        borderBottomWidth: 1,
        borderBottomColor: colors.ink,
    },
    button: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.ink,
        borderRadius: 4,
    },
    buttonText: { fontSize: 15, color: colors.ink, fontFamily: fonts.serif },
});