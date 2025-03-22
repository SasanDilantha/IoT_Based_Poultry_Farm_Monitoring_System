import { 
    Text,
    SafeAreaView,
    StyleSheet,
    Platform,
    StatusBar
} from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import HomeScreen from '../screens/HomeScreen'

const App = () => {
  return (
    <HomeScreen />
  )
};

export default App

const styles = StyleSheet.create({
    codegenNativeCommandscontainer: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: colors.bgwhite,
      },   
});