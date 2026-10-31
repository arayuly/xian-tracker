import { ProgressCard } from '@/components/ProgressCard';
import { Screen } from '@/components/Screen';
import { LEVELS } from '@/constants/levels';
import { colors, fonts } from '@/constants/xian';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PathScreen() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [pushups, setPushups] = useState(0);
  const [pages, setPages] = useState(0);

  const level = LEVELS[levelIndex];
  const isMax = levelIndex === LEVELS.length - 1;
  const canBreakthrough = !isMax && pushups >= level.pushups && pages >= level.pages;

  function handleBreakthrough() {
    const next = LEVELS[levelIndex + 1];
    // излишек переносится на следующий уровень
    setPushups(pushups - level.pushups);
    setPages(pages - level.pages);
    setLevelIndex(levelIndex + 1);
    Alert.alert('Прорыв!', `${next.realm} · ${next.stage}`);
  }

  return (
    <Screen seal="道" title="Путь">
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.realm}>
            {level.hanzi ? `${level.realm} · ${level.hanzi}` : level.realm}
          </Text>
          <Text style={styles.layer}>
            {level.stage} · уровень {levelIndex + 1} из {LEVELS.length}
          </Text>
        </View>

        {isMax ? (
          <Text style={styles.summit}>Ты достиг вершины Пути.</Text>
        ) : (
          <>
            <ProgressCard
              title="Отжимания"
              unit="раз"
              current={pushups}
              goal={level.pushups}
              onAdd={(n) => setPushups(pushups + n)}
            />
            <ProgressCard
              title="Чтение"
              unit="стр."
              current={pages}
              goal={level.pages}
              onAdd={(n) => setPages(pages + n)}
            />

            <Pressable
              style={[styles.breakthrough, !canBreakthrough && styles.breakthroughOff]}
              disabled={!canBreakthrough}
              onPress={handleBreakthrough}
            >
              <Text style={styles.breakthroughText}>突破 · Прорыв</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 20, paddingBottom: 24 },
  realm: { fontSize: 22, letterSpacing: 1, color: colors.ink, fontFamily: fonts.serif },
  layer: { fontSize: 14, marginTop: 4, color: colors.inkSoft, fontFamily: fonts.serif },
  summit: { fontSize: 18, color: colors.seal, fontFamily: fonts.serif },
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