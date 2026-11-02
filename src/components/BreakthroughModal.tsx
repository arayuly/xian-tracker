import { colors, fonts } from '@/constants/xian';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
    visible: boolean;
    label: string;
    realm: string;
    stage: string;
    onClose: () => void;
};

export function BreakthroughModal({ visible, label, realm, stage, onClose }: Props) {
    const stamp = useRef(new Animated.Value(0)).current; // 0 → 1: печать
    const text = useRef(new Animated.Value(0)).current; // 0 → 1: надписи

    useEffect(() => {
        if (!visible) return;
        stamp.setValue(0);
        text.setValue(0);
        Animated.sequence([
            Animated.timing(stamp, {
                toValue: 1,
                duration: 420,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(text, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
    }, [visible, stamp, text]);

    // Печать «падает» с увеличенного размера до обычного
    const stampScale = stamp.interpolate({ inputRange: [0, 1], outputRange: [2.6, 1] });

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose}>
                <Animated.View
                    style={[styles.seal, { opacity: stamp, transform: [{ scale: stampScale }] }]}
                >
                    <Text style={styles.sealText}>破</Text>
                </Animated.View>

                <Animated.View style={[styles.texts, { opacity: text }]}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.realm}>{realm}</Text>
                    <Text style={styles.stage}>{stage}</Text>
                    <Text style={styles.hint}>Нажми, чтобы продолжить</Text>
                </Animated.View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
        backgroundColor: 'rgba(244, 239, 230, 0.97)',
    },
    seal: {
        width: 120,
        height: 120,
        borderRadius: 6,
        backgroundColor: colors.seal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sealText: { fontSize: 72, color: colors.paper, fontFamily: fonts.serif },
    texts: { alignItems: 'center', gap: 8 },
    label: { fontSize: 13, letterSpacing: 3, color: colors.inkSoft, fontFamily: fonts.serif },
    realm: { fontSize: 28, letterSpacing: 1, color: colors.ink, fontFamily: fonts.serif },
    stage: { fontSize: 18, color: colors.seal, fontFamily: fonts.serif },
    hint: { marginTop: 24, fontSize: 13, color: colors.inkSoft, fontFamily: fonts.serif },
});