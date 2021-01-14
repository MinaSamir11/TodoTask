import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  Text,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import BackgroundTimer from '../../helper/BackgroundTimer';

import {useAsyncStorage} from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('screen');

// config animation collapse
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const WatcherTask = () => {
  const [Watcher, setWatcher] = useState(false);
  const timer = useRef();
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
    setTotalSeconds((prev) => prev + 1);
  };

  const getTimeFormated = () => {
    let timeForamted = '';
    let hours = Math.floor(TotalSeconds / 3600) + '';
    let minutes = parseInt((TotalSeconds / 60) % 60) + '';
    let seconds = (TotalSeconds % 60) + '';

    if (hours.length < 2) {
      timeForamted = '0' + hours + ':';
    } else {
      timeForamted = hours + ':';
    }

    if (minutes.length < 2) {
      timeForamted = timeForamted + '0' + minutes + ':';
    } else {
      timeForamted = timeForamted + minutes + ':';
    }

    if (seconds.length < 2) {
      timeForamted = timeForamted + '0' + seconds;
    } else {
      timeForamted = timeForamted + seconds;
    }
    return timeForamted;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1}}>
        {!Watcher && (
          <View>
            <Text style={{fontSize: 16, fontWeight: 'bold', margin: 15}}>
              {'Last time spend in task: ' + LastSpentTime}
            </Text>

            <TextInput
              style={{
                width: width * 0.8,
                height: 40,
                alignSelf: 'center',
                backgroundColor: '#F3F3F3',
                color: '#000',
                fontWeight: 'bold',
                paddingHorizontal: 10,
              }}
              placeholder="Enter Task Name"
            />
          </View>
        )}

        <Text style={{fontSize: 16, fontWeight: 'bold', margin: 15}}>
          Timer:{'  '}
          {getTimeFormated()}
        </Text>

        <View style={{justifyContent: 'flex-end', flex: 1, marginBottom: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Pressable
              onPress={() => {
                if (!Watcher) {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                  setWatcher(true);
                  timer.current = BackgroundTimer.setInterval(callBack, 1);
                }
              }}
              style={{
                backgroundColor: '#18CC04',
                width: width * 0.3,
                height: 42,
                alignItems: 'center',
                justifyContent: 'center',
                marginStart: 10,
                marginEnd: 10,
                borderRadius: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}>
                Start
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                setWatcher(false);
                BackgroundTimer.clearInterval(timer.current);
              }}
              style={{
                backgroundColor: '#FB3E29',
                width: width * 0.3,
                height: 42,
                alignItems: 'center',
                justifyContent: 'center',
                marginStart: 10,
                marginEnd: 10,
                borderRadius: 8,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'white',
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}>
                Stop
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default WatcherTask;
