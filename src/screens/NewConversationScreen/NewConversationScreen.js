import { View, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { Wrapper } from '../../infrastructure/components/wrappper/wrapper'
import { AuthButton, AuthInput } from '../../components/Accounts/AccountStyles'
import { Spacer } from '../../infrastructure/components/spacer/spacer'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { UserInfoContext } from '../../features/userInfo/UserInfoContext'

export default function NewConversationScreen({navigation}) {
  const [number,setNumber]=useState()
  const {addNewConversation}=useContext(UserInfoContext)

  const HandlePress=async()=>{
    const ChatId=await addNewConversation(number)
    navigation.navigate("Chat",{ChatId:ChatId})

  }

  return (
    <Wrapper style={{alignItems:'center',justifyContent:'center'}}>
        <AuthInput onChangeText={(p)=>setNumber(p)} label="Friend's Phone Number" />
        <Spacer size="large" />
        <AuthButton textColor='white' onPress={HandlePress} >Start Chatting!</AuthButton>
    </Wrapper>
  )
}