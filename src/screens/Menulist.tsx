import React, {useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {text} from '../text';
import {svg} from '../assets/svg';
import {theme} from '../constants';
import {components} from '../components';
import type {RootStackParamList} from '../types';
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from '../store/slices/apiSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Menulist'>;

const Menulist: React.FC<Props> = ({route}): JSX.Element => {
  const {category} = route.params;

  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [selectedTab, setSelectedTab] = useState<'services' | 'products'>(
    'services',
  );

  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = useGetProductsQuery();
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery();

  const services = productsData instanceof Array ? productsData : [];
  const categories = categoriesData instanceof Array ? categoriesData : [];

  // Cart state
  const [cart, setCart] = useState<{[key: string]: number}>({});

  // Functions to manage cart
  const addToCart = (itemId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const currentQuantity = prevCart[itemId] || 0;
      if (currentQuantity <= 1) {
        const newCart = {...prevCart};
        delete newCart[itemId];
        return newCart;
      } else {
        return {
          ...prevCart,
          [itemId]: currentQuantity - 1,
        };
      }
    });
  };

  if (loading) {
    return <components.Loader />;
  }

  const renderStatusBar = () => {
    return <components.StatusBar />;
  };

  const renderHeader = () => {
    return <components.Header goBack={true} title='Menu' basket={true} />;
  };

  const renderSearchBar = () => {
    return (
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          height: 50,
          marginBottom: 14,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.white,
            flex: 1,
            borderRadius: 10,
            marginRight: 5,
            padding: 5,
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <View
            style={{
              backgroundColor: theme.colors.mainTurquoise,
              width: 40,
              height: '100%',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 14,
            }}
          >
            <svg.SearchSvg />
          </View>
          <TextInput
            placeholder='Search ...'
            style={{
              flex: 1,
              ...theme.fonts.DMSans_400Regular,
              fontSize: 16,
              color: theme.colors.mainColor,
            }}
            placeholderTextColor={theme.colors.textColor}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.white,
            borderRadius: 10,
            height: 50,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <svg.FilterSvg />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTabs = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginHorizontal: 20,
          marginBottom: 14,
        }}
      >
        <TouchableOpacity
          onPress={() => setSelectedTab('services')}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: selectedTab === 'services' ? 2 : 0,
            borderColor: theme.colors.mainTurquoise,
          }}
        >
          <Text
            style={{
              color:
                selectedTab === 'services'
                  ? theme.colors.mainTurquoise
                  : theme.colors.textColor,
              ...theme.fonts.DMSans_400Regular,
              fontSize: 16,
            }}
          >
            Services
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedTab('products')}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: selectedTab === 'products' ? 2 : 0,
            borderColor: theme.colors.mainTurquoise,
          }}
        >
          <Text
            style={{
              color:
                selectedTab === 'products'
                  ? theme.colors.mainTurquoise
                  : theme.colors.textColor,
              ...theme.fonts.DMSans_400Regular,
              fontSize: 16,
            }}
          >
            Products
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    if (selectedTab === 'services') {
      const servicesByCategory = services?.filter((service) =>
        service.category?.includes(selectedCategory),
      );

      if (servicesByCategory.length === 0) {
        return (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: theme.colors.textColor,
                textAlign: 'center',
                ...theme.fonts.DMSans_400Regular,
              }}
            >
              No services are available at your location
            </Text>
          </View>
        );
      }

      return (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {servicesByCategory?.map((item, index, array) => {
            const lastItem = index === array.length - 1;
            const quantity = cart[item.id] || 0; // Get quantity from cart
            return (
              <components.MenuListItem
                item={item}
                lastItem={lastItem}
                key={item.id}
                quantity={quantity} // Pass the quantity to MenuListItem
                onAdd={() => addToCart(item.id)} // Pass add function
                onRemove={() => removeFromCart(item.id)} // Pass remove function
              />
            );
          })}
        </ScrollView>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: theme.colors.textColor,
              textAlign: 'center',
              ...theme.fonts.DMSans_400Regular,
            }}
          >
            No products are available from this nursery
          </Text>
        </View>
      );
    }
  };

  const renderHomeIndicator = () => {
    return <components.HomeIndicator />;
  };

  return (
    <components.SmartView>
      {renderStatusBar()}
      {renderHeader()}
      {renderSearchBar()}
      {renderTabs()}
      {renderContent()}
      {renderHomeIndicator()}
    </components.SmartView>
  );
};

export default Menulist;
