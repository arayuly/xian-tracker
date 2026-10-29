import { Screen } from '@/components/Screen';
import { colors, fonts } from '@/constants/xian';
import { StyleSheet, Text } from 'react-native';

export default function ProfileScreen() {
    return (
        <Screen seal="我" title="Профиль">
            <Text style={styles.text}>Здесь будет твой профиль</Text>
        </Screen>
    );
}

const styles = StyleSheet.create({
    text: { fontSize: 16, color: colors.inkSoft, fontFamily: fonts.serif },
});