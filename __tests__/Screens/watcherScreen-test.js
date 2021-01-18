import React from 'react';
import {render, act} from '@testing-library/react-native';
import WatcherScreen from '../../src/Screens/Watcher';

jest.mock('react-native-background-timer', () => ({
  stopBackgroundTimer: jest.fn(),
}));

describe('test Watcher Screen', () => {
  it('should Renders WATCHER screen and MatchSnapShot', () => {
    const {toJSON} = render(<WatcherScreen />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should Screen has 2 button and textInput', async () => {
    const {getByTestId} = render(<WatcherScreen />);

    await act(async () => {
      expect(getByTestId('WATCHER-SCREEN')).toBeTruthy();
      expect(getByTestId('INPUT-TASK_NAME')).toBeTruthy();
      expect(getByTestId('START-BTN')).toBeTruthy();
      expect(getByTestId('STOP-BTN')).toBeTruthy();
    });
  });
});
