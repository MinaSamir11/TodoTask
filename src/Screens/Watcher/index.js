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

const WatcherTask = () => {
  const [Watcher, setWatcher] = useState(false);
  const [TotalMiliSeconds, setTotalMiliSeconds] = useState(0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  //using call back to prevent rerender to Button
  const onStart = useCallback(() => {
    if (!Watcher) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setWatcher(true);

      BackgroundTimer.runBackgroundTimer(() => {
        setTotalMiliSeconds((prevState) => prevState + 1);
      }, 1000);
    }
  }, [Watcher]);

  //using call back to prevent rerender to Button
  const onStop = useCallback(() => {
    if (Watcher) {
      writeItemToStorage(getTimeFormated());
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setWatcher(false);
      setTotalMiliSeconds(0);
      BackgroundTimer.stopBackgroundTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Watcher, writeItemToStorage]);

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
