import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GiftCard {
  id: string;
  name: string;
  code: string;
}

interface GiftCardState {
  cards: GiftCard[];
}

const initialState: GiftCardState = {
  cards: [],
};

const persistCards = async (cards: GiftCard[]) => {
  try {
    await AsyncStorage.setItem('@giftCards', JSON.stringify(cards));
  } catch (error) {
    console.error('Failed to save cards:', error);
  }
};

const giftCardSlice = createSlice({
  name: 'giftCard',
  initialState,
  reducers: {
    setGiftCards: (state, action: PayloadAction<GiftCard[]>) => {
      state.cards = action.payload;
    },
    addGiftCard: (state, action: PayloadAction<GiftCard>) => {
      state.cards.push(action.payload);
    },
    removeCard: (state, action: PayloadAction<string>) => {
      state.cards = state.cards.filter(card => card.id !== action.payload);
    },
  },
});

export const { setGiftCards, addGiftCard, removeCard } = giftCardSlice.actions;
export default giftCardSlice.reducer;
