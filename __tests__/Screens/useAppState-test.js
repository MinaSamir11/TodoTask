import useAppState from '../../src/Screens/Watcher/useAppState';
import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react-native';
import {AppState} from 'react-native';

let fireEvent = null;
const mockAddListener = jest.fn((event, callback) => {
  if (event === 'change') {
    fireEvent = callback;
  }
});

jest.resetModules();
jest.doMock('react-native/Libraries/AppState/AppState', () => ({
  addEventListener: mockAddListener,
  removeEventListener: jest.fn(),
}));

describe('address actions', () => {
  it('should return the appState to equal background', () => {
    AppState.currentState = 'active';
    const mockFun = jest.fn();
    const {result} = renderHook(() =>
      useAppState({
        onBackground: mockFun,
      }),
    );
    act(() => {
      fireEvent('background');
    });
    expect(result.current.appState).toEqual('background');
    expect(mockFun).toHaveBeenCalled();
  });

  it('should return appState to equal active and call onForeground func', () => {
    AppState.currentState = 'background';
    const mockFun = jest.fn();

    const {result} = renderHook(() =>
      useAppState({
        onForeground: mockFun,
      }),
    );

    act(() => {
      fireEvent('active');
    });

    expect(result.current.appState).toEqual('active');
    expect(mockFun).toHaveBeenCalled();
  });

  it('should return appState to equal inactive and call onChange func', () => {
    AppState.currentState = 'active';
    const mockFun = jest.fn();

    const {result} = renderHook(() =>
      useAppState({
        onChange: mockFun,
      }),
    );

    act(() => {
      fireEvent('inactive');
    });

    expect(result.current.appState).toEqual('inactive');
    expect(mockFun).toHaveBeenCalled();
  });
});
