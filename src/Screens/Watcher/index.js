import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  Text,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import BackgroundTimer from '../../helper/BackgroundTimer';

const {width} = Dimensions.get('screen');

const WatcherTask = () => {
  const [Watcher, setWatcher] = useState(false);
  const timer = useRef();
  const [TotalSeconds, setTotalSeconds] = useState(0);

  const callBack = () => {
    setTotalSeconds((prev) => prev + 1);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1}}>
        {!Watcher && (
          <Text style={{fontSize: 16, fontWeight: 'bold', margin: 15}}>
            {'Last time spend in task: ' + new Date().toDateString()}
          </Text>
        )}
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
        {!Watcher && (
          <Text style={{fontSize: 16, fontWeight: 'bold', margin: 15}}>
            Timer:{'  '}
            {(Math.floor(TotalSeconds / 3600) + '').length < 2
              ? '0' + Math.floor(TotalSeconds / 3600)
              : Math.floor(TotalSeconds / 3600)}
            :
            {(parseInt(TotalSeconds / 60) + '').length < 2
              ? '0' + parseInt(TotalSeconds / 60)
              : parseInt(TotalSeconds / 60)}
            :
            {((TotalSeconds % 60) + '').length < 2
              ? '0' + (TotalSeconds % 60)
              : TotalSeconds % 60}
          </Text>
        )}
        <View style={{justifyContent: 'flex-end', flex: 1, marginBottom: 20}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Pressable
              onPress={() => {
                timer.current = BackgroundTimer.setInterval(callBack, 1);
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
