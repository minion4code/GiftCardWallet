import React from 'react';
import { Alert } from 'react-native';
import { HiddenItem } from '../GiftCardList';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import GiftCardListScreen from '../GiftCardList';
import { NavigationContainer } from '@react-navigation/native';
import * as slices from '../../store/slices/giftCardSlice';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

const mockStore = configureMockStore([thunk]);

const renderWithProviders = (store: any) => {
  const navigationMock = { navigate: jest.fn() };

  return render(
    <Provider store={store}>
      <NavigationContainer>
        <GiftCardListScreen navigation={navigationMock} />
      </NavigationContainer>
    </Provider>
  );
};

describe('GiftCardListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state if no cards', () => {
    const store = mockStore({ giftCard: { cards: [] } });
    const { getByText } = renderWithProviders(store);

    expect(getByText('No Gift Cards added yet')).toBeTruthy();
  });

  it('should render card items from Redux', () => {
    const store = mockStore({
      giftCard: {
        cards: [
          { id: '1', name: 'Visa', code: '1234' },
          { id: '2', name: 'Amazon', code: '5678' },
        ],
      },
    });

    const { getByText } = renderWithProviders(store);

    expect(getByText('Visa - 1234')).toBeTruthy();
    expect(getByText('Amazon - 5678')).toBeTruthy();
  });

  it('should dispatch removeCard when delete is confirmed', async () => {
    const store = mockStore({
      giftCard: {
        cards: [{ id: '1', name: 'Visa', code: '1234' }],
      },
    });
  
    const removeCardSpy = jest.spyOn(slices, 'removeCard').mockReturnValue({ type: 'giftCard/removeCard', payload: '1' });
  
    // Mock Alert to simulate clicking "Delete"
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      const deleteBtn = buttons?.find(b => b.text === 'Delete');
      deleteBtn?.onPress?.(); // simulate Delete press
    });
  
    // Manually invoke delete handler (simulate hidden swipe button)
    const { getByRole } = render(
      <Provider store={store}>
        <HiddenItem
          item={{ id: '1' }}
          onDelete={(id) => store.dispatch(slices.removeCard(id))}
        />
      </Provider>
    );
  
    fireEvent.press(getByRole('button')); // now the button is accessible
  
    await waitFor(() => {
      expect(removeCardSpy).toHaveBeenCalledWith('1');
    });
  });
});