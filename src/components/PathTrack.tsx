import { BreakthroughModal } from '@/components/BreakthroughModal';
import { ProgressCard } from '@/components/ProgressCard';
import { LEVELS } from '@/constants/levels';
import { colors, fonts } from '@/constants/xian';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';

type Props = {
    label: string; // «Культивация» или «Дао · 道»
    levelIndex: number;
    goalKey: 'pushups' | 'pages'; // какая цель из таблицы уровней нужна этому пути
    progress: number;
    cardTitle: string;
    unit: string;
    lastAdded: number; // последняя запись (0, если отменять нечего)
    onAdd: (amount: number) => void;
    onUndo: () => void;
    onBreakthrough: () => void;
};

export function PathTrack({
    label,
    levelIndex,
    goalKey,
    progress,
    cardTitle,
    unit,
    lastAdded,
    onAdd,
    onUndo,
    onBreakthrough,
}: Props) {
    const [showCelebration, setShowCelebration] = useState(false);
    const [reached, setReached] = useState({ step: '', realm: '', stage: '' });

    const level = LEVELS[levelIndex];
    const goal = level[goalKey];
    const isMax = levelIndex === LEVELS.length - 1;
    const canBreakthrough = !isMax && progress >= goal;

    function handlePress() {
        const next = LEVELS[levelIndex + 1];
        onBreakthrough();
        Vibration.vibrate(60);
        setReached({ step: next.step, realm: next.realm, stage: next.stage });
        setShowCelebration(true);
    }

    return (
        <View style={styles.track}>
            <View>
                <Text style={styles.label}>
                    {label} · {level.step}
                </Text>
                <Text style={styles.realm}>
                    {level.hanzi ? `${level.realm} · ${level.hanzi}` : level.realm}
                </Text>
                <Text style={styles.stage}>
                    {level.stage} · уровень {levelIndex + 1} из {LEVELS.length}
                </Text>
            </View>

            {isMax ? (
                <Text style={styles.summit}>Вершина достигнута.</Text>
            ) : (
                <>
                    <ProgressCard
                        title={cardTitle}
                        unit={unit}
                        current={progress}
                        goal={goal}
                        onAdd={onAdd}
                    />

                    {lastAdded > 0 && (
                        <Pressable onPress={onUndo} hitSlop={10} style={styles.undoWrap}>
                            <Text style={styles.undo}>
                                Отменить последнее: +{lastAdded} {unit}
                            </Text>
                        </Pressable>
                    )}

                    <Pressable
                        style={[styles.breakthrough, !canBreakthrough && styles.breakthroughOff]}
                        disabled={!canBreakthrough}
                        onPress={handlePress}
                    >
                        <Text style={styles.breakthroughText}>突破 · Прорыв</Text>
                    </Pressable>
                </>
            )}

            <BreakthroughModal
                visible={showCelebration}
                label={`${label} · ${reached.step}`}
                realm={reached.realm}
                stage={reached.stage}
                onClose={() => setShowCelebration(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    track: { gap: 16 },
    label: { fontSize: 13, letterSpacing: 2, color: colors.inkSoft, fontFamily: fonts.serif },
    realm: { fontSize: 22, letterSpacing: 1, marginTop: 4, color: colors.ink, fontFamily: fonts.serif },
    stage: { fontSize: 14, marginTop: 4, color: colors.inkSoft, fontFamily: fonts.serif },
    summit: { fontSize: 18, color: colors.seal, fontFamily: fonts.serif },
    undoWrap: { alignSelf: 'flex-start' },
    undo: {
        fontSize: 13,
        color: colors.inkSoft,
        fontFamily: fonts.serif,
        textDecorationLine: 'underline',
    },
    breakthrough: {
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: colors.seal,
    },
    breakthroughOff: { backgroundColor: colors.line },
    breakthroughText: { fontSize: 16, letterSpacing: 2, color: colors.paper, fontFamily: fonts.serif },
});