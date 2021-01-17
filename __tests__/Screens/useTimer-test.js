import AsyncStorage from '@react-native-async-storage/async-storage';
import {renderHook, act} from '@testing-library/react-hooks';
import useTimer from '../../src/Screens/Watcher/useTimer';
import BackgroundTimer from 'react-native-background-timer';

jest.resetModules();
jest.mock('react-native-background-timer', () => ({
  runBackgroundTimer: jest.fn((callBack) => {
    callBack();
  }, 1000),
}));

describe('Timer Hook Behavoir', () => {
  const RealDate = Date.now;

  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date('2019-04-07T10:20:30Z').getTime());
  });

  afterAll(() => {
    global.Date.now = RealDate;
  });

  it('should get key START_TIME from async storage and resume time if key exist and calculate diffrence between two time now and START_TIME', async () => {
    const expectItemsAsyncStorage = [['@START_TIME', '1610891747783']];
    const items = ['@START_TIME'];

    const TIME_NOW = Date.now();
    const START_TIME = parseFloat(expectItemsAsyncStorage[0][1]);

    const millis = TIME_NOW - START_TIME;
    const TOTAL_SECONDS_BEFORE_INCREMENT = Math.floor(millis / 1000);

    jest
      .spyOn(AsyncStorage, 'multiGet')
      .mockReturnValueOnce(Promise.resolve(expectItemsAsyncStorage));

    const {result} = renderHook(() => useTimer());

    expect(result.current.TotalSeconds).toBe(0);
    await act(() => result.current.resumeTimer());
    expect(AsyncStorage.multiGet).toHaveBeenCalledWith(items);
    expect(BackgroundTimer.runBackgroundTimer).toHaveBeenCalled();
    expect(result.current.TotalSeconds).toBe(
      TOTAL_SECONDS_BEFORE_INCREMENT + 1,
    );
  });

  it('Should run Func runTimerInBackground after that increment Total Second by 1', () => {
    const {result} = renderHook(() => useTimer());

    const TOTAL_SECONDS_BEFORE_INCREMENT = result.current.TotalSeconds;

    jest.spyOn(BackgroundTimer, 'runBackgroundTimer');

    act(() => result.current.runTimerInBackground());
    expect(BackgroundTimer.runBackgroundTimer).toHaveBeenLastCalledWith(
      expect.any(Function),
      1000,
    );

    expect(result.current.TotalSeconds).toBe(
      TOTAL_SECONDS_BEFORE_INCREMENT + 1,
    );
  });

  it('Should check that multiSet in async storage has been called to set keys START_TIME && TASK_NAME in func addTimeTaskToAsync', async () => {
    const taskName = 'task-name-test';
    const timeNow = Date.now();
    const START_TIME = ['@START_TIME', timeNow.toString()];
    const TASK_NAME = ['@TASK_NAME', taskName];

    const expectItemsAsyncStorage = [START_TIME, TASK_NAME];

    jest.spyOn(AsyncStorage, 'multiSet');

    const {result} = renderHook(() => useTimer());

    await act(() => result.current.addTimeTaskToAsync(timeNow, taskName));
    expect(AsyncStorage.multiSet).toHaveBeenCalledWith(expectItemsAsyncStorage);
  });

  it('Should check that multiRemove has been called to rm keys START_TIME && TASK_NAME in func rmTimeTaskAddSpentTimeToAsync', async () => {
    const {result} = renderHook(() => useTimer());

    act(() => {
      result.current.setTotalSeconds(720);
    });

    const rmKeys = ['@START_TIME', '@TASK_NAME'];

    jest.spyOn(AsyncStorage, 'multiRemove');

    await act(() => result.current.rmTimeTaskAddSpentTimeToAsync());

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(rmKeys);
  });

  it('Should check that multiSet in async storage has been called to set keys SPEND_TIME in func rmTimeTaskAddSpentTimeToAsync', async () => {
    const {result} = renderHook(() => useTimer());

    act(() => {
      result.current.setTotalSeconds(720);
    });

    const SPEND_TIME = ['@SPEND_TIME', '00:12:00'];

    const expectItemsAsyncStorage = [SPEND_TIME];

    jest.spyOn(AsyncStorage, 'multiSet');

    await act(() => result.current.rmTimeTaskAddSpentTimeToAsync());

    expect(AsyncStorage.multiSet).toHaveBeenCalledWith(expectItemsAsyncStorage);
  });

  it('Should return Time Formated in 00:00:00 if TotalSeconds at initalState', async () => {
    const {result} = renderHook(() => useTimer());
    expect(result.current.getTimeFormated()).toStrictEqual('00:00:00');
  });

  it('Should return Time Formated in 00:12:00 if TotalSeconds is 720 ', async () => {
    const {result} = renderHook(() => useTimer());
    act(() => {
      result.current.setTotalSeconds(720);
    });
    expect(result.current.getTimeFormated()).toStrictEqual('00:12:00');
  });

  it('Should return Time Formated at section hour 00 if TotalSeconds has not pass an hour ', async () => {
    const {result} = renderHook(() => useTimer());
    act(() => {
      result.current.setTotalSeconds(3456);
    });
    expect(result.current.getTimeFormated().slice(0, 2)).toStrictEqual('00');
  });

  it('Should return Time Formated at section hour not zeros if TotalSeconds has pass more than 60 minute ', async () => {
    const {result} = renderHook(() => useTimer());
    act(() => {
      result.current.setTotalSeconds(3600);
    });

    expect(
      parseFloat(result.current.getTimeFormated().slice(0, 2)) !== 0,
    ).toBeTruthy();
  });

  it('Should return Time Formated at section minutes 00 if TotalSeconds has not pass a minute', async () => {
    const {result} = renderHook(() => useTimer());
    act(() => {
      result.current.setTotalSeconds(10);
    });
    expect(result.current.getTimeFormated().slice(3, 5)).toStrictEqual('00');
  });

  it('Should return Time Formated at section minutes 00 if totalSeconds always reach in minutes 60 minute ', async () => {
    const {result} = renderHook(() => useTimer());
    act(() => {
      result.current.setTotalSeconds(3600);
    });
    expect(result.current.getTimeFormated().slice(3, 5)).toStrictEqual('00');
  });

  it('Should return Time Formated at section seconds 00 if TotalSeconds 0 and if totalSeconds always reach in seconds 60 sec', async () => {
    const {result} = renderHook(() => useTimer());

    act(() => {
      result.current.setTotalSeconds(0);
    });
    expect(
      result.current.getTimeFormated().slice(6, 8).toString(),
    ).toStrictEqual('00');

    act(() => {
      result.current.setTotalSeconds(120);
    });
    expect(
      result.current.getTimeFormated().slice(6, 8).toString(),
    ).toStrictEqual('00');
  });
});
