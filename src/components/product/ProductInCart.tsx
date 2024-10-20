import React from 'react';
import type {PropsWithChildren} from 'react';
import {TouchableOpacity, Text} from 'react-native';

import {svg} from '../../assets/svg';
import {ProductType} from '../../types';
import {useAppDispatch} from '../../hooks';
import {showMessage} from 'react-native-flash-message';
import {addToCart} from '../../store/slices/cartSlice';

type Props = PropsWithChildren<{
  item: ProductType;
  containerStyle?: object;
}>;

const DishInCart: React.FC<Props> = ({item, containerStyle}): JSX.Element => {
  const dispatch = useAppDispatch();

  return (
    <TouchableOpacity
      style={{...containerStyle}}
      onPress={() => {
        dispatch(addToCart(item)); // Add to cart regardless of existence
        showMessage({
          message: 'Success',
          description: `${item.name} added to cart`,
          type: 'success',
          icon: 'success',
        });
      }}
    >
      <svg.PlusSvg />
    </TouchableOpacity>
  );
};

export default DishInCart;
