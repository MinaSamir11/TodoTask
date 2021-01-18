import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getMultiple,
  multiSet,
  removeFew,
} from '../../src/Screens/Watcher/asyncStorage';

describe('asyncStorage actions', () => {
  it('should set values to async storage', async () => {
    const TEST = ['@TEST'];

    jest.spyOn(AsyncStorage, 'multiSet');

    await multiSet([TEST]);
    expect(AsyncStorage.multiSet).toHaveBeenCalledWith([TEST]);
  });

  it('should get Multiple keys from asyncStorage ', async () => {
    const testKey = ['@TEST', '@TEST_2'];
    const expectItemsAsyncStorage = [
      [testKey[0], 'test-value'],
      [testKey[1], 'test-value2'],
    ];

    jest
      .spyOn(AsyncStorage, 'multiGet')
      .mockReturnValueOnce(Promise.resolve(expectItemsAsyncStorage));

    const values = await getMultiple(testKey);

    expect(AsyncStorage.multiGet).toHaveBeenCalledWith(testKey);

    expect(values[0][0]).toBe(testKey[0]);
    expect(values[1][0]).toBe(testKey[1]);
    expect(values[0][1]).toBe(expectItemsAsyncStorage[0][1]);
    expect(values[1][0]).toBe(expectItemsAsyncStorage[1][0]);
  });
  it('should remove items from async storage', async () => {
    const rmKeys = ['foo', 'testItem'];

    jest.spyOn(AsyncStorage, 'multiRemove');

    await removeFew(rmKeys);

    expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(rmKeys);
  });
});
