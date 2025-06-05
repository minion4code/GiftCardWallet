import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

const giftCardSlice = createSlice({
  name: 'giftCard',
  initialState,
  reducers: {
    addGiftCard: (state, action: PayloadAction<GiftCard>) => {
      state.cards.push(action.payload);
    },
    removeCard: (state, action: PayloadAction<string>) => {
      state.cards = state.cards.filter(card => card.id !== action.payload);
    },
  },
});

export const { addGiftCard, removeCard } = giftCardSlice.actions;
export default giftCardSlice.reducer;
