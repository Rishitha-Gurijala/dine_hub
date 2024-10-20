import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MapView, {Marker, MapEvent, Region} from 'react-native-maps';
import * as Location from 'expo-location';
import {components} from '../../components';
import {theme} from '../../constants';
import {useAppNavigation} from '../../hooks'; // Import the navigation hook

import {text} from '../../text';
import {svg} from '../../assets/svg';
import {homeIndicatorHeight} from '../../utils';

type LocationCoords = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const LocationScreen: React.FC = (): JSX.Element => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [originalLocation, setOriginalLocation] =
    useState<LocationCoords | null>(null); // Store original user location
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [addressDetails, setAddressDetails] = useState({
    flatNo: '',
    street: '',
    area: '',
    landmark: '',
  });

  const mapRef = useRef<MapView>(null);
  const navigation = useAppNavigation(); // Initialize the navigation hook

  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      const userCoords: LocationCoords = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(userCoords);
      setOriginalLocation(userCoords); // Save the original location
      setSelectedLocation(userCoords); // Set initial marker location to user's location
    })();
  }, []);

  const handleMapPress = (event: MapEvent): void => {
    const newLocation = {
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    };
    setSelectedLocation(newLocation); // Update only the selected location
  };

  const resetToUserLocation = async () => {
    if (originalLocation) {
      if (mapRef.current) {
        mapRef.current.animateToRegion(originalLocation, 1000);
      }
      setSelectedLocation(originalLocation); // Reset marker to original location
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAddressDetails((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <components.SmartView>
      <components.Header goBack={true} />

      <Text style={styles.appName}>Flitzy</Text>
      <Text style={styles.locline}>Choose your Location</Text>

      <View style={styles.mapContainer}>
        {location && (
          <MapView
            ref={mapRef}
            style={styles.map}
            region={location as Region}
            onPress={handleMapPress}
          >
            {location && !selectedLocation && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title='Your Location'
                pinColor={theme.colors.mainTurquoise}
              />
            )}
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title='Selected Location'
                pinColor={theme.colors.mainTurquoise}
              />
            )}
          </MapView>
        )}

        <TouchableOpacity
          style={styles.locationIconContainer}
          onPress={resetToUserLocation}
        >
          <Text style={styles.locationIconText}>📍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <components.InputField
          value={addressDetails.flatNo}
          placeholder='Flat No / Door No'
          onChangeText={(value) => handleInputChange('flatNo', value)}
          containerStyle={{marginBottom: 14}}
        />
        <components.InputField
          value={addressDetails.street}
          placeholder='Street'
          onChangeText={(value) => handleInputChange('street', value)}
          containerStyle={{marginBottom: 14}}
        />
        <components.InputField
          value={addressDetails.area}
          placeholder='Area'
          onChangeText={(value) => handleInputChange('area', value)}
          containerStyle={{marginBottom: 14}}
        />
        <components.InputField
          value={addressDetails.landmark}
          placeholder='Landmark'
          onChangeText={(value) => handleInputChange('landmark', value)}
          containerStyle={{marginBottom: 14}}
        />

        <components.Button
          title='Save Location'
          containerStyle={{marginTop: 20}}
          onPress={() => {
            console.log('Location Saved:', selectedLocation, addressDetails);
            navigation.navigate('TabNavigator');
          }}
        />
      </ScrollView>
    </components.SmartView>
  );
};

const styles = StyleSheet.create({
  appName: {
    fontSize: 34,
    fontWeight: 'bold',
    color: theme.colors.mainTurquoise,
    textAlign: 'center',
  },
  mapContainer: {
    height: Dimensions.get('window').height * 0.4,
    borderBottomWidth: 1,
    borderColor: theme.colors.lightGray,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  locationIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: theme.colors.white,
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  locationIconText: {
    fontSize: 24,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: theme.colors.white,
  },
  locline: {
    fontSize: 25,
    fontWeight: 'bold',
    color: theme.colors.mainTurquoise,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LocationScreen;
