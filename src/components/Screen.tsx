import { colors, fonts } from '@/constants/xian';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    seal: string;
    title: string;
    children?: ReactNode;
};

export function Screen({ seal, title, children }: Props) {
    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.seal}>
                    <Text style={styles.sealText}>{seal}</Text>
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.body}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.paper },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    seal: {
        width: 44,
        height: 44,
        borderRadius: 4,
        backgroundColor: colors.seal,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sealText: { fontSize: 24, color: colors.paper, fontFamily: fonts.serif },
    title: { fontSize: 26, letterSpacing: 2, color: colors.ink, fontFamily: fonts.serif },
    line: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.line,
        marginHorizontal: 24,
    },
    body: { flex: 1, padding: 24 },
});