import { ProgressCard } from '@/components/ProgressCard';
import { Screen } from '@/components/Screen';
import { colors, fonts } from '@/constants/xian';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Пока цели заданы вручную. На шаге 3 они будут браться из таблицы уровней.
const PUSHUPS_GOAL = 40;
const PAGES_GOAL = 15;

export default function PathScreen() {
  const [pushups, setPushups] = useState(0);
  const [pages, setPages] = useState(0);

  const canBreakthrough = pushups >= PUSHUPS_GOAL && pages >= PAGES_GOAL;

  return (
    <Screen seal="道" title="Путь">
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.realm}>Конденсация Ци</Text>
          <Text style={styles.layer}>1-й слой</Text>
        </View>

        <ProgressCard
          title="Отжимания"
          unit="раз"
          current={pushups}
          goal={PUSHUPS_GOAL}
          onAdd={(n) => setPushups(pushups + n)}
        />
        <ProgressCard
          title="Чтение"
          unit="стр."
          current={pages}
          goal={PAGES_GOAL}
          onAdd={(n) => setPages(pages + n)}
        />

        <Pressable
          style={[styles.breakthrough, !canBreakthrough && styles.breakthroughOff]}
          disabled={!canBreakthrough}
          onPress={() => Alert.alert('Прорыв!', 'Скоро здесь будет новый уровень')}
        >
          <Text style={styles.breakthroughText}>突破 · Прорыв</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 20, paddingBottom: 24 },
  realm: { fontSize: 22, letterSpacing: 1, color: colors.ink, fontFamily: fonts.serif },
  layer: { fontSize: 14, marginTop: 4, color: colors.inkSoft, fontFamily: fonts.serif },
  breakthrough: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: colors.seal,
  },
  breakthroughOff: { backgroundColor: colors.line },
  breakthroughText: { fontSize: 16, letterSpacing: 2, color: colors.paper, fontFamily: fonts.serif },
});