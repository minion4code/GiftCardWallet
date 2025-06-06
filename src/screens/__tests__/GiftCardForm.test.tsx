import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import * as slices from '../../store/slices/giftCardSlice';
import GiftCardFormScreen from '../GiftCardForm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const mockHandleError = jest.fn();

jest.mock('../../utils/errorHandling', () => ({
  __esModule: true,
  ...jest.requireActual('../../utils/errorHandling'),
  handleError: mockHandleError,
}));

const mockStore = configureMockStore([thunk]);

const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();

const renderWithNavigation = (params = {}) => {
  const store = mockStore({});
  return render(
    <Provider store={store}>
      <GiftCardFormScreen
        navigation={{ goBack: mockNavigate, setOptions: mockSetOptions }}
        route={{ params }}
      />
    </Provider>
  );
};

describe('GiftCardFormScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleError.mockClear();
  });

  it('renders in readonly mode correctly', () => {
    const { getByDisplayValue, queryByText } = renderWithNavigation({
      card: { name: 'Visa', code: '1234' },
      readonly: true,
    });

    expect(getByDisplayValue('Visa')).toBeTruthy();
    expect(getByDisplayValue('1234')).toBeTruthy();
    expect(queryByText('Save')).toBeNull();
  });

  it('renders in editable mode and saves a new card', async () => {
    const spy = jest.spyOn(slices, 'addGiftCard');
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      buttons?.[0].onPress?.(); // simulate "OK" press
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByPlaceholderText, getByText } = renderWithNavigation();

    fireEvent.changeText(getByPlaceholderText('Enter card name'), 'Amazon');
    fireEvent.changeText(getByPlaceholderText('Enter card code'), '5678');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(spy).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@giftCards',
        expect.stringContaining('Amazon')
      );
      expect(alertSpy).toHaveBeenCalledWith(
        'Success',
        'Gift card has been saved.',
        expect.any(Array)
      );
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});