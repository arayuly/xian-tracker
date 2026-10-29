import { Screen } from '@/components/Screen';
import { colors, fonts } from '@/constants/xian';
import { StyleSheet, Text } from 'react-native';

export default function CultivatorsScreen() {
    return (
        <Screen seal="宗" title="Культиваторы">
            <Text style={styles.text}>Здесь будет список культиваторов</Text>
        </Screen>
    );
}

const styles = StyleSheet.create({
    text: { fontSize: 16, color: colors.inkSoft, fontFamily: fonts.serif },
});