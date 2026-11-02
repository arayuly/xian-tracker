import { PathTrack } from '@/components/PathTrack';
import { Screen } from '@/components/Screen';
import { colors } from '@/constants/xian';
import { usePlayer } from '@/state/player';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function PathScreen() {
  const {
    levelIndex,
    daoLevelIndex,
    pushups,
    pages,
    lastPushups,
    lastPages,
    addPushups,
    addPages,
    undoPushups,
    undoPages,
    breakthroughBody,
    breakthroughDao,
  } = usePlayer();

  return (
    <Screen seal="道" title="Путь">
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PathTrack
          label="Культивация"
          levelIndex={levelIndex}
          goalKey="pushups"
          progress={pushups}
          cardTitle="Отжимания"
          unit="раз"
          lastAdded={lastPushups}
          onAdd={addPushups}
          onUndo={undoPushups}
          onBreakthrough={breakthroughBody}
        />

        <View style={styles.divider} />

        <PathTrack
          label="Дао · 道"
          levelIndex={daoLevelIndex}
          goalKey="pages"
          progress={pages}
          cardTitle="Чтение"
          unit="стр."
          lastAdded={lastPages}
          onAdd={addPages}
          onUndo={undoPages}
          onBreakthrough={breakthroughDao}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 28, paddingBottom: 24 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.line },
});