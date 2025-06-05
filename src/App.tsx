import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux';
import { store } from './store';

import GiftCardList from './screens/GiftCardList';
import GiftCardFormScreen from './screens/GiftCardForm';

const Stack = createStackNavigator();

(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

const App = (): React.ReactElement => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="GiftCardList"
            component={GiftCardList}
            options={({ navigation }) => ({
              title: 'Gift Cards',
              gestureEnabled: false,
              swipeEnabled: false,
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('GiftCardForm')}
                  style={{ marginRight: 16 }}
                >
                  <Ionicons name="add" size={24} color="black" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="GiftCardForm"
            component={GiftCardFormScreen}
            options={{
              title: 'Add Gift Card',
              gestureEnabled: false,
              swipeEnabled: false,
              headerTintColor: 'black',
              headerBackTitle: '',
            } as StackNavigationOptions}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
