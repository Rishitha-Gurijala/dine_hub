import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import type {ProductType} from '../../types';

type WishlistState = {
  list: ProductType[];
};

const initialState: WishlistState = {
  list: [],
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<ProductType>) => {
      const inWishlist = state.list.find(
        (item) => item.id === action.payload.id,
      );

      if (!inWishlist) {
        state.list.push({
          ...action.payload,
        });
        fetch("http://localhost:3000/api/wishlist", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: '634501',
            wishListProduct: action.payload.id,
            operation: "add"
          }),
        }).then((response) => response.json()).then((responseData) => {
          console.log('===========Add============')
            console.log(JSON.stringify(responseData));
          })
      }
    },
    removeFromWishlist: (state, action: PayloadAction<ProductType>) => {
      const inWishlist = state.list.find(
        (item) => item.id === action.payload.id,
      );

      if (inWishlist) {
        state.list = state.list.filter((item) => item.id !== action.payload.id);
      }
      fetch("http://localhost:3000/api/wishlist", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: '634501',
          wishListProduct: action.payload.id,
          operation: "delete"
        }),
      }).then((response) => response.json()).then((responseData) => {
        console.log('===========Remove============')
          console.log(JSON.stringify(responseData));
        })
    },
  },
});

export const {addToWishlist, removeFromWishlist} = wishlistSlice.actions;
