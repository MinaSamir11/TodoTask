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
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import {Button} from '../../Components';
import useAppState from './useAppState';

const WatcherTask = () => {
  const [Watcher, setWatcher] = useState(false);
  const [TotalSeconds, setTotalSeconds] = useState(0);
  const [LastSpentTime, setLastSpentTime] = useState(null);
  const [value, onChangeText] = useState('');
  const {appState} = useAppState({
    onBackground: () => {
      BackgroundTimer.stopBackgroundTimer();
    },
    onForeground: async () => {
      resumeTimer();
    },
  });

  const getMultiple = async (keys) => {
    let values;
    try {
      values = await AsyncStorage.multiGet(keys);
      return values;
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const multiSet = async (newValues) => {
    try {
      await AsyncStorage.multiSet(newValues);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const removeFew = async (keys) => {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  useEffect(() => {
    const fetchAsyncStorage = async () => {
      const values = await getMultiple(['@START_DATE', '@SPEND_TIME']);

      if (values[0][1] !== null) {
        setWatcher(true);
        resumeTimer();
      } else {
        setLastSpentTime(values[1][1]);
      }
    };
    fetchAsyncStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resumeTimer = async () => {
    let keys = ['@START_DATE', '@TASK_NAME'];

    const values = await getMultiple(keys);
    const START_DATE = values[0][1];

    if (START_DATE !== null) {
      const millis = Date.now() - parseFloat(START_DATE);
      setTotalSeconds(Math.floor(millis / 1000));
      runTimerInBackground();
      onChangeText(values[1][1]);
    }
  };

  const getTimeFormated = useCallback(() => {
    let timeFormatted = '';
    let hours = Math.floor(TotalSeconds / 3600) + '';
    let minutes = parseInt((TotalSeconds / 60) % 60) + '';
    let seconds = (TotalSeconds % 60) + '';

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
  }, [TotalSeconds]);

  const runTimerInBackground = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setTotalSeconds((prevState) => prevState + 1);
    }, 1000);
  };

  //using call back to prevent rerender to Button
  const onStart = useCallback(() => {
    if (!Watcher) {
      const DATE_NOW = ['@START_DATE', Date.now().toString()];
      const TASK_NAME = ['@TASK_NAME', value];

      multiSet([DATE_NOW, TASK_NAME]);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setWatcher(true);
      runTimerInBackground();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Watcher]);

  const onStop = useCallback(async () => {
    if (Watcher) {
      setLastSpentTime(getTimeFormated());

      const rmKeys = ['@START_DATE', '@TASK_NAME'];
      const lastSpendTime = ['@SPEND_TIME', getTimeFormated()];

      await removeFew(rmKeys);
      await multiSet([lastSpendTime]);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setWatcher(false);
      setTotalSeconds(0);
      onChangeText('');
      BackgroundTimer.stopBackgroundTimer();
    }
  }, [Watcher, getTimeFormated]);

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
          value={value}
          onChangeText={(text) => onChangeText(text)}
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
