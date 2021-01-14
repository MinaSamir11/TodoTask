import React, {useState, useEffect, useCallback} from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  LayoutAnimation,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import styles from './styles';
import {Button} from '../../Components';
import useAppState from './useAppState';

const WatcherTask = () => {
  const [Watcher, setWatcher] = useState(false);
  const [TotalMiliSeconds, setTotalSeconds] = useState(0);
  const [LastSpentTime, setLastSpentTime] = useState(null);
  const {getItem, setItem, removeItem} = useAsyncStorage('startDate');
  const {appState} = useAppState({
    onBackground: () => {
      BackgroundTimer.stopBackgroundTimer();
    },
    onForeground: async () => {
      resumeTimer();
    },
  });

  const readItemFromStorage = async () => {
    const startDate = await getItem();
    if (startDate !== null) {
      setWatcher(true);
      resumeTimer();
    }
  };

  useEffect(() => {
    readItemFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resumeTimer = async () => {
    const startDate = await getItem();
    if (startDate !== null) {
      const millis = Date.now() - parseFloat(startDate);
      setTotalSeconds(Math.floor(millis / 1000));
      runTimerInBackground();
    }
  };

  const writeItemToStorage = async (newValue) => {
    await setItem(newValue);
  };

  const getTimeFormated = () => {
    let timeFormatted = '';
    let hours = Math.floor(TotalMiliSeconds / 3600) + '';
    let minutes = parseInt((TotalMiliSeconds / 60) % 60) + '';
    let seconds = (TotalMiliSeconds % 60) + '';

    if (hours.length < 2) {
      timeFormatted = '0' + hours + ':';
    } else {
      timeFormatted = hours + ':';
    }

    if (minutes.length < 2) {
      timeFormatted = timeFormatted + '0' + minutes + ':';
    } else {
      timeFormatted = timeFormatted + minutes + ':';
    }

    if (seconds.length < 2) {
      timeFormatted = timeFormatted + '0' + seconds;
    } else {
      timeFormatted = timeFormatted + seconds;
    }
    return timeFormatted;
  };

  const runTimerInBackground = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setTotalSeconds((prevState) => prevState + 1);
    }, 1000);
  };

  //using call back to prevent rerender to Button
  const onStart = useCallback(() => {
    if (!Watcher) {
      writeItemToStorage(Date.now().toString());
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setWatcher(true);
      runTimerInBackground();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Watcher]);

  //using call back to prevent rerender to Button
  const onStop = useCallback(async () => {
    if (Watcher) {
      await removeItem();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setLastSpentTime(getTimeFormated());
      setWatcher(false);
      setTotalSeconds(0);
      BackgroundTimer.stopBackgroundTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Watcher]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.MainContainer}>
        {!Watcher && (
          <Text style={styles.LastTimeTxt}>
            {'Last time spend in task: ' + LastSpentTime}
          </Text>
        )}

        <TextInput
          style={styles.TaskNameInput}
          placeholder="Enter Task Name"
          editable={!Watcher}
        />

        <Text style={styles.TimerTxt}>
          Timer:{'  '}
          {getTimeFormated()}
        </Text>

        <View style={styles.ContianerStartStopBtns}>
          <View style={styles.SubContainerBtns}>
            <Button
              onPress={onStart}
              Title={'Start'}
              style={styles.StartBtn}
              styleTxt={styles.StartBtnTxt}
            />

            <Button
              onPress={onStop}
              Title={'Stop'}
              style={styles.StopBtn}
              styleTxt={styles.StopBtnTxt}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default WatcherTask;
