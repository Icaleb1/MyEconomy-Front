import { NavigationContainer } from '@react-navigation/native';
import Cadastro from './src/views/Cadastro';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Login from './src/views/Login';
import Home from './src/views/Home';
import Perfil from './src/views/Perfil';
import Limite from './src/views/Limite';
import Despesa from './src/views/Despesa';

const Stack = createNativeStackNavigator();

export default function Layout() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if(!token) {
        setInitialRoute('login');
      } else {
        setInitialRoute('home')
      }  
    };
    checkAuth();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="cadastro" component={Cadastro} options={{ headerShown: false }} />
        <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="perfil" component={Perfil} options={{ headerShown: false }}/>
        <Stack.Screen name="limite" component={Limite} options={{ headerShown: false }} />
        <Stack.Screen name="despesa" component={Despesa} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
