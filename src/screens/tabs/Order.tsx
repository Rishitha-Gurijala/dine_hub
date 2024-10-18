import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

import {text} from '../../text';
import {svg} from '../../assets/svg';
import {theme} from '../../constants';
import {useAppDispatch, useAppSelector, useAppNavigation} from '../../hooks';
import {setScreen} from '../../store/slices/tabSlice';
import BottomTabBar from '../../navigation/BottomTabBar';
import {BASE_URL, ENDPOINTS, AUTHORIZATION_TOKEN} from '../../config';
import {components} from '../../components';

const Order: React.FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const cart = useAppSelector((state) => state.cartSlice.list);
  const subtotal = useAppSelector((state) => state.cartSlice.subtotal);
  const delivery = useAppSelector((state) => state.cartSlice.delivery);
  const totalFromCart = Number(
    useAppSelector((state) => state.cartSlice.total),
  );
  const deliveryFromCart = Number(
    useAppSelector((state) => state.cartSlice.delivery),
  );

  const [promocode, setPromocode] = useState('');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(
    (Number(totalFromCart) + Number(deliveryFromCart)).toFixed(2),
  );
  const [discount, setDiscount] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'services' | 'products'>(
    'services',
  );

  useEffect(() => {
    setTotal((totalFromCart + deliveryFromCart - discount).toFixed(2));
  }, [totalFromCart, deliveryFromCart, discount]);

  const applyPromoCode = async () => {
    setLoading(true);
    const url = BASE_URL + ENDPOINTS.get.discount;

    try {
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + AUTHORIZATION_TOKEN,
        },
        params: {promocode},
      });

      if (res.data.promocode.discount) {
        const discountValue =
          (Number(total) * res.data.promocode.discount) / 100;
        setTotal((Number(total) - discountValue).toFixed(2));
        setDiscount(discountValue);
      }
    } catch (err) {
      console.log(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBar = () => <components.StatusBar />;

  const renderHeader = () => (
    <components.Header basket={true} userImage={true} />
  );

  const renderPromoCodeApplied = () => {
    if (discount > 0) {
      return (
        <View style={{marginBottom: responsiveHeight(7)}}>
          <svg.CodeAppliedSvg />
        </View>
      );
    }
    return null;
  };

  const renderPromoCodeInput = () => {
    if (discount === 0) {
      return (
        <View style={styles.promoCodeContainer}>
          <TextInput
            placeholder='Enter your promocode'
            value={promocode}
            onChangeText={(text) => setPromocode(text)}
            style={styles.promoCodeInput}
          />
          <TouchableOpacity style={styles.applyButton} onPress={applyPromoCode}>
            {loading ? (
              <ActivityIndicator size='small' color={theme.colors.white} />
            ) : (
              <Text style={styles.applyText}>apply</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderOrderSummary = () => (
    <View style={styles.orderSummaryContainer}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Subtotal</Text>
        <text.T14 style={{color: theme.colors.mainColor}}>${subtotal}</text.T14>
      </View>
      {discount > 0 && (
        <View style={styles.discountRow}>
          <text.T14>Discount</text.T14>
          <text.T14>- ${discount.toFixed(2)}</text.T14>
        </View>
      )}
      <View style={styles.summaryRow}>
        <text.T14>Delivery</text.T14>
        <text.T14>${delivery}</text.T14>
      </View>
      <View style={styles.summaryRow}>
        <text.H4>Total</text.H4>
        <text.H4>${total}</text.H4>
      </View>
    </View>
  );

  const renderDishes = () => (
    <View>
      {cart.map((item, index) => (
        <components.OrderItem
          item={item}
          key={item.id}
          containerStyle={{marginBottom: index === cart.length - 1 ? 20 : 14}}
        />
      ))}
    </View>
  );

  const renderContent = () => {
    if (selectedTab === 'services') {
      return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          {renderDishes()}
          {renderPromoCodeApplied()}
          {renderPromoCodeInput()}
          {renderOrderSummary()}
        </ScrollView>
      );
    }
    return (
      <View style={styles.noProductsContainer}>
        <Text style={styles.noProductsText}>No products added</Text>
      </View>
    );
  };

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'services' && styles.activeTab]}
        onPress={() => setSelectedTab('services')}
      >
        <Text
          style={
            selectedTab === 'services'
              ? styles.activeTabText
              : styles.inactiveTabText
          }
        >
          Services
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'products' && styles.activeTab]}
        onPress={() => setSelectedTab('products')}
      >
        <Text
          style={
            selectedTab === 'products'
              ? styles.activeTabText
              : styles.inactiveTabText
          }
        >
          Products
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <components.SmartView>
      {renderStatusBar()}
      {renderHeader()}
      {renderTabs()}
      {renderContent()}
      <BottomTabBar />
      <components.HomeIndicator />
    </components.SmartView>
  );
};

const styles = {
  scrollViewContainer: {flexGrow: 1, paddingHorizontal: 20, paddingTop: 10},
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.mainTurquoise,
    marginBottom: 30,
  },
  promoCodeInput: {
    flex: 1,
    paddingLeft: 14,
    fontSize: 14,
    color: theme.colors.mainColor,
  },
  applyButton: {
    width: '30%',
    height: '100%',
    backgroundColor: theme.colors.mainTurquoise,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyText: {
    fontSize: 14,
    color: theme.colors.white,
    textTransform: 'uppercase',
  },
  orderSummaryContainer: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.colors.mainTurquoise,
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryText: {fontSize: 14, color: theme.colors.mainColor},
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noProductsText: {
    fontSize: 18,
    color: theme.colors.textColor,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 14,
  },
  tab: {flex: 1, alignItems: 'center', paddingVertical: 10},
  activeTab: {borderBottomWidth: 2, borderColor: theme.colors.mainTurquoise},
  activeTabText: {color: theme.colors.mainTurquoise, fontSize: 16},
  inactiveTabText: {color: theme.colors.textColor, fontSize: 16},
};

export default Order;
