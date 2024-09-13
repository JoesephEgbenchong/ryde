import CustomButton from '@/components/CustomButton'
import InputField from '@/components/InputField'
import OAuth from '@/components/OAuth'
import { icons, images } from '@/constants'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignUp = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const onSignUpPress = async () => {

    }

  return (
    <ScrollView className='flex-1 bg-white'>
        <View className='flex-1 bg-white'>
            <View className='relative w-full h-[250px]'>
                <Image 
                    source={images.signUpCar}
                    className='z-0 w-full h-[250px]'
                />
                <Text className='text-2xl text-black font-JakartaBold absolute bottom-5 left-5'>Create Your Account</Text>
            </View>

            <View className='p-5'>
                <InputField 
                    label="Name"
                    placeholder="Enter your name"
                    icon={icons.person}
                    value={form.name}
                    onChangeText = {(value) => setForm({...form, name: value })}
                />

                <InputField 
                    label="Email"
                    placeholder="Enter your email"
                    icon={icons.email}
                    value={form.email}
                    onChangeText = {(value) => setForm({...form, email: value })}
                />

                <InputField 
                    label="Password"
                    placeholder="Enter your password"
                    icon={icons.lock}
                    value={form.password}
                    secureTextEntry={true}
                    onChangeText = {(value) => setForm({...form, password: value })}
                />

                <CustomButton 
                    title='Sign Up' 
                    className='mt-6'
                    onPress={onSignUpPress}
                />

                <OAuth />

                <Link href="/(auth)/sign-in" className='text-lg text-center text-general-200 mt-10'>
                    <Text>Already have an account? </Text>
                    <Text className='text-primary-500'>Log in</Text>
                </Link>
            </View>

            {/** Verification Modal */}
        </View>
    </ScrollView>
  )
}

export default SignUp