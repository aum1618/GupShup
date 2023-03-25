import React, { useEffect } from 'react'
import { useContext } from 'react'
import { Avatar } from 'react-native-paper'
import { ProfilesContext } from '../../features/Profiles/ProfilesContext'

export default function ProfilePhoto({ number, size }) {
  const {profileUrls}=useContext(ProfilesContext)
  useEffect(()=>{
  },[profileUrls])

 
  return (
    <>
      {!profileUrls[number] ? (
        <Avatar.Icon icon="account" size={size} />
      ) : (
        <Avatar.Image source={{ uri:profileUrls[number] }} size={size} />
      )}
    </>
  )
}
