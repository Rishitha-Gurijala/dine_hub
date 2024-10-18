import axios from 'axios';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import * as ImagePicker from 'expo-image-picker'; // Import the image picker
import {svg} from '../assets/svg';
import {theme} from '../constants';
import {showMessage} from '../utils';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import {setUser} from '../store/slices/userSlice';
import {BASE_URL, ENDPOINTS, CONFIG} from '../config';
import {useAppSelector, useAppDispatch} from '../hooks';

const EditProfile: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();
  const user = useAppSelector((state) => state.userSlice.user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [image, setImage] = useState<string | null>(null); // To store the selected image

  const inp1Ref = useRef<TextInput>({focus: () => {}} as TextInput);
  const inp2Ref = useRef<TextInput>({focus: () => {}} as TextInput);
  const inp3Ref = useRef<TextInput>({focus: () => {}} as TextInput);
  const inp4Ref = useRef<TextInput>({focus: () => {}} as TextInput);

  useEffect(() => {
    if (loading) {
      inp1Ref.current.blur();
      inp2Ref.current.blur();
      inp3Ref.current.blur();
    }
  }, [loading]);

  // Function to handle image selection
  const pickImage = async () => {
    // Ask for permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Open image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Set the selected image
    }
  };

  const renderStatusBar = () => {
    return <components.StatusBar />;
  };

  const renderHeader = () => {
    return <components.Header goBack={true} title='Edit profile' />;
  };

  const renderUserImage = () => {
    return (
      <TouchableOpacity
        onPress={pickImage} // Trigger image picker on press
        style={{
          width: 100,
          height: 100,
          alignSelf: 'center',
          marginBottom: 30,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Display the selected image if available */}
        {image ? (
          <Image
            source={{uri: image}} // Use the selected image's URI
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 50,
            }}
          />
        ) : (
          <components.Image
            source={{
              uri: 'https://george-fx.github.io/dine-hub/10.jpg', // Default image
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: 50,
            }}
          />
        )}

        {/* Overlay and icon for picking an image */}
        <View
          style={{
            backgroundColor: theme.colors.mainColor,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            top: 0,
            borderRadius: 50,
            opacity: 0.3,
          }}
        />
        <svg.CameraSvg />
      </TouchableOpacity>
    );
  };

  const renderInputFields = () => {
    return (
      <React.Fragment>
        <components.InputField
          value={userName}
          innerRef={inp1Ref}
          placeholder='Jordan Hebert'
          onChangeText={(text) => setUserName(text)}
          type='username'
          containerStyle={{marginBottom: 14}}
        />
        <components.InputField
          value={email}
          innerRef={inp2Ref}
          placeholder='jordanhebert@mail.com'
          onChangeText={(text) => setEmail(text)}
          type='email'
          checkIcon={true}
          containerStyle={{marginBottom: 14}}
        />
        <components.InputField
          value={phone}
          innerRef={inp3Ref}
          placeholder='+17123456789'
          onChangeText={(text) => setPhone(text)}
          type='phone'
          containerStyle={{marginBottom: 14}}
        />
        <components.InputField
          value={country}
          innerRef={inp4Ref}
          placeholder='Chicago, USA'
          onChangeText={(text) => setCountry(text)}
          type='location'
          containerStyle={{marginBottom: 20}}
        />
      </React.Fragment>
    );
  };

  const renderButton = () => {
    return (
      <View>
        <components.Button
          title='Save changes'
          loading={loading}
          onPress={async () => {
            setLoading(true);
            try {
              // Prepare form data
              const formData = new FormData();
              formData.append('email', email);
              formData.append('userName', userName);
              formData.append('country', country);
              formData.append('phone', phone);

              let imageFile = null; // Initialize imageFile variable

              if (image) {
                imageFile = {
                  uri: image,
                  name: 'profile.jpg',
                  type: 'image/jpeg',
                };
                formData.append('profileImage', imageFile);
              }

              // Log the form data to console
              console.log('Form Data:', {
                email,
                userName,
                country,
                phone,
                profileImage: imageFile, // Log imageFile (it will be null if not set)
              });

              // Example POST request (adjust based on your API)
              const response = await axios.post(
                `${BASE_URL}${ENDPOINTS.EDIT_PROFILE}`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    ...CONFIG.headers,
                  },
                },
              );

              // Assuming the response returns the updated user
              dispatch(setUser(response.data.user));
              showMessage('Profile updated successfully!');
              navigation.goBack();
            } catch (error) {
              showMessage('Failed to update profile. Please try again.');
              console.error('Error updating profile:', error); // Log the error for debugging
            } finally {
              setLoading(false);
            }
          }}
          containerStyle={{marginBottom: 14}}
        />
      </View>
    );
  };

  const renderContent = () => {
    const contentContainerStyle = {
      backgroundColor: theme.colors.white,
      marginHorizontal: 20,
      paddingBottom: 30,
      paddingTop: 50,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 10,
      flexGrow: 0,
    };

    return (
      <components.KAScrollView
        contentContainerStyle={{...contentContainerStyle}}
      >
        {renderUserImage()}
        {renderInputFields()}
        {renderButton()}
      </components.KAScrollView>
    );
  };

  const renderHomeIndicator = () => {
    return <components.HomeIndicator />;
  };

  return (
    <components.SmartView>
      {renderStatusBar()}
      {renderHeader()}
      {renderContent()}
      {renderHomeIndicator()}
    </components.SmartView>
  );
};

export default EditProfile;
