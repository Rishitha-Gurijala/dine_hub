import React, {useState} from 'react';
import {
  View,
  Text,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import {text} from '../../text';
import {svg} from '../../assets/svg';
import {theme} from '../../constants';
import {components} from '../../components';
import {useAppNavigation} from '../../hooks';
import {homeIndicatorHeight} from '../../utils';

const SignIn: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const handleProceed = async () => {
    if (phoneNumber.trim()) {
      try {
        // API request to check if user exists
        const response = await fetch('https://api subhadip gives me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber.trim(),
          }),
        });

        const result = await response.json();

        if (result.userExists) {
          navigation.navigate('TabNavigator');
        } else {
          navigation.navigate('SignUp');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Please enter a valid phone number');
    }
  };

  const renderStatusBar = () => {
    return <components.StatusBar />;
  };

  const renderHeader = () => {
    return <components.Header goBack={true} />;
  };

  const renderWelcome = () => {
    return <text.H1 style={{marginBottom: 14}}>Welcome To Flitzy!</text.H1>;
  };

  const renderDescription = () => {
    return (
      <text.T16 style={{marginBottom: 30}}>
        Enter your phone number to proceed
      </text.T16>
    );
  };

  const renderInputField = () => {
    return (
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType='phone-pad'
        placeholder='Phone Number'
        style={{
          borderWidth: 1,
          borderColor: theme.colors.borderColor,
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
          fontSize: 16,
          color: theme.colors.text,
        }}
      />
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        title='Proceed'
        containerStyle={{marginBottom: 20}}
        onPress={handleProceed}
      />
    );
  };

  const renderDonTHaveAccount = () => {
    return (
      <components.ParsedText
        parse={[
          {
            pattern: /Sign up./,
            style: {color: theme.colors.mainTurquoise},
            onPress: () => navigation.navigate('TabNavigator'), // for now i changed to tabnavigator thats it this renderDontHaveaccount is of no use
          },
        ]}
      >
        Don’t have an account? Sign up.
      </components.ParsedText>
    );
  };

  const renderFooter = () => {
    const styles: ViewStyle = {
      backgroundColor: theme.colors.white,
      width: '48%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    };

    const containerStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 20,
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: homeIndicatorHeight() === 0 ? 20 : 10,
    };

    return (
      <View style={{...containerStyle}}>
        <View style={{...styles}}>
          <svg.FacebookSvg />
        </View>
        <View style={{...styles}}>
          <svg.GoogleSvg />
        </View>
      </View>
    );
  };

  const renderHomeIndicator = () => {
    return <components.HomeIndicator />;
  };

  const renderContent = () => {
    const styles: ViewStyle = {
      flexGrow: 1,
      backgroundColor: theme.colors.white,
      paddingHorizontal: 20,
      marginHorizontal: 20,
      borderTopEndRadius: 10,
      borderTopStartRadius: 10,
      justifyContent: 'center',
      marginTop: 10,
    };

    return (
      <components.KAScrollView contentContainerStyle={{...styles}}>
        {renderWelcome()}
        {renderDescription()}
        {renderInputField()}
        {renderButton()}
        {renderDonTHaveAccount()}
      </components.KAScrollView>
    );
  };

  return (
    <components.SmartView>
      {renderStatusBar()}
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
      {renderHomeIndicator()}
    </components.SmartView>
  );
};

export default SignIn;
