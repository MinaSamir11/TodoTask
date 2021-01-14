import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import WatcherScreen from './src/Screens/Watcher';

const App = () => {
  return (
    <SafeAreaView style={styles.MainContainer}>
      <WatcherScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  MainContainer: {flex: 1},
});
export default App;
