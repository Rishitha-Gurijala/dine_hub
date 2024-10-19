import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {ProductType} from '../../types';

type CartItemType = {
  list: ProductType[];
  total: string;
  delivery: number;
  subtotal: string;
};

const initialState = {
  list: [] as ProductType[],
  total: '0.00',
  subtotal: '0.00',
  delivery: 2,
};

// type StateType = typeof initialState;

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state: CartItemType, action: PayloadAction<ProductType>) => {
      const inCart = state.list.find((item) => item.id === action.payload.id);

      if (inCart) {
        state.list.map((item: ProductType) => {
          if (item.id === action.payload.id) {
            if (item.quantity) {
              item.quantity += 1;
            }
          }
          return item;
        }, state);
        state.total = (
          Number(state.total) + Number(action.payload.price)
        ).toFixed(2);
        state.subtotal = (
          Number(state.subtotal) + Number(action.payload.price)
        ).toFixed(2);
      } else {
        state.list.push({
          ...action.payload,
          quantity: 1,
        });
        // state.total += action.payload.price;
        state.total = (
          Number(state.total) + Number(action.payload.price)
        ).toFixed(2);
        state.subtotal = (
          Number(state.subtotal) + Number(action.payload.price)
        ).toFixed(2);
      }

      fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: '634501',
          cartProduct: action.payload.id,
          operation: "add"
        }),
      }).then((response) => response.json()).then((responseData) => {
        console.log('===========Add============')
          console.log(JSON.stringify(responseData));
        })
    },
    removeFromCart: (state, action: PayloadAction<ProductType>) => {
      const inCart = state.list.find((item) => item.id === action.payload.id);

      if (inCart) {
        state.list.map((item) => {
          if (item.id === action.payload.id && (item.quantity as number) > 1) {
            if (item.quantity) {
              item.quantity -= 1;
            }
          } else if (item.id === action.payload.id && item.quantity === 1) {
            state.list.splice(state.list.indexOf(item), 1);
          }
          return item;
        }, state);
        // state.total -= action.payload.price;
        state.total = (
          Number(state.total) - Number(action.payload.price)
        ).toFixed(2);
        state.subtotal = (
          Number(state.subtotal) - Number(action.payload.price)
        ).toFixed(2);

        
      fetch("http://localhost:3000/api/cart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: '634501',
          cartProduct: action.payload.id,
          operation: "delete"
        }),
      }).then((response) => response.json()).then((responseData) => {
        console.log('===========Delete============')
          console.log(JSON.stringify(responseData));
        })

      }
    },

    fullRemoveFromCart: (state, action) => {
      const inCart = state.list.find((item) => item.id === action.payload.id);

      if (inCart) {
        state.list.map((item) => {
          if (item.id === action.payload.id) {
            state.total = (
              Number(state.total) -
              Number(item.price) * (item.quantity as number)
            ).toFixed(2);
            // state.total -= item.price * (item.quantity as number);
            state.list.splice(state.list.indexOf(item), 1);
          }
          return item;
        }, state);
      }
    },

    resetCart: (state) => {
      state.list = [];
      state.total = '0.00';
      state.subtotal = '0.00';
      state.delivery = 2;
    },
  },
});

export const {addToCart, removeFromCart, resetCart, fullRemoveFromCart} =
  cartSlice.actions;

export default cartSlice.reducer;
