import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import MainStackNavigator from './MainStackNavigator'
import { AccountNavigator } from './AccountsNavigator'
import { AuthenticationContext } from '../authentication/authenticationContext'

export default function Index() {
  const {isAuthenticated}=useContext(AuthenticationContext)
  return (
    <NavigationContainer>
        {isAuthenticated ? <MainStackNavigator /> : <AccountNavigator /> }
    </NavigationContainer>
  )
}