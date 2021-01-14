import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  TextInput,
  View,
  Text,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import BackgroundTimer from '../../helper/BackgroundTimer';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import styles from './styles';

// config animation collapse
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WatcherTask = () => {
  const timer = useRef();

  const [Watcher, setWatcher] = useState(false);
  const [TotalSeconds, setTotalSeconds] = useState(0);
  const [LastSpentTime, setLastSpentTime] = useState(0);
  const {getItem, setItem} = useAsyncStorage('last_time');

  const readItemFromStorage = async () => {
    const item = await getItem();
    setLastSpentTime(item);
  };

  const writeItemToStorage = async (newValue) => {
    await setItem(newValue);
    setLastSpentTime(newValue);
  };

  useEffect(() => {
    readItemFromStorage();
  }, []);

  const callBack = () => {
    setTotalSeconds((prevState) => prevState + 1);
  };

  const getTimeFormated = () => {
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
  };

  const onStart = () => {
    if (!Watcher) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setWatcher(true);
      timer.current = BackgroundTimer.setInterval(callBack, 1);
    }
  };

  const onStop = () => {
    if (Watcher) {
      writeItemToStorage(getTimeFormated());
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setWatcher(false);
      setTotalSeconds(0);
      BackgroundTimer.clearInterval(timer.current);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.MainContainer}>
        {!Watcher && (
          <View>
            <Text style={styles.LastTimeTxt}>
              {'Last time spend in task: ' + LastSpentTime}
            </Text>

            <TextInput
              style={styles.TaskNameInput}
              placeholder="Enter Task Name"
            />
          </View>
        )}

        <Text style={styles.TimerTxt}>
          Timer:{'  '}
          {getTimeFormated()}
        </Text>

        <View style={styles.ContianerStartStopBtns}>
          <View style={styles.SubContainerBtns}>
            <Pressable onPress={onStart} style={styles.StartBtn}>
              <Text style={styles.StartBtnTxt}>Start</Text>
            </Pressable>

            <Pressable onPress={onStop} style={styles.StopBtn}>
              <Text style={styles.StopBtnTxt}>Stop</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default WatcherTask;
