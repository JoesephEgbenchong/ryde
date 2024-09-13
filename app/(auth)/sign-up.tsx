import CustomButton from '@/components/CustomButton'
import InputField from '@/components/InputField'
import OAuth from '@/components/OAuth'
import { icons, images } from '@/constants'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import ReactNativeModal from 'react-native-modal'
import { SafeAreaView } from 'react-native-safe-area-context'

const SignUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [verification, setVerification] = useState({
        state: 'default',
        error: '',
        code: ''
    });

    const onSignUpPress = async () => {
        if (!isLoaded) {
          return
        }
    
        try {
          await signUp.create({
            emailAddress: form.email,
            password: form.password,
          })
    
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
    
          setVerification({
            ...verification,
            state: 'pending'
          })
        } catch (err: any) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(err, null, 2))
          Alert.alert('Error', err.errors[0].longMessage);
        }
      }
    
      const onPressVerify = async () => {
        if (!isLoaded) {
          return
        }
    
        try {
          const completeSignUp = await signUp.attemptEmailAddressVerification({
            code: verification.code,
          })
    
          if (completeSignUp.status === 'complete') {
            //todo: create a database user
            await setActive({ session: completeSignUp.createdSessionId })
            setVerification({...verification, state: "success"});
          } else {
            console.error(JSON.stringify(completeSignUp, null, 2))
            setVerification({...verification, error: "verification failed", state: "failed"})
          }
        } catch (err: any) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(err, null, 2))
          setVerification({
            ...verification,
            error: err.errors[0].longMessage,
            state: "failed",
          })
        }
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

            {/**pending status verification modal */}
            <ReactNativeModal 
                isVisible={verification.state === "pending"} 
                onModalHide={() => setVerification({...verification, state: "success"})}
            >
                <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
                    <Text className='text-2xl font-JakartaExtraBold mb-2'>
                        Verification
                    </Text>
                    <Text className='font-Jakarta mb-5'>
                        We've sent a verification code to {form.email}
                    </Text>

                    <InputField 
                        label='Code'
                        icon={icons.lock}
                        placeholder='12345'
                        value={verification.code}
                        keyboardType='numeric'
                        onChangeText={(code) => setVerification({...verification, code: code})}
                    />

                    {verification.error && (
                        <Text className='text-sm text-red-500 mt-1'>{verification.error}</Text>
                    )}

                    <CustomButton 
                        title='Verify Email'
                        onPress={onPressVerify}
                        className='mt-5 bg-success-500'
                    />
                </View>
            </ReactNativeModal>

            {/** Successful verification Modal */}
            <ReactNativeModal isVisible={verification.state === "success"}>
                <View className='bg-white px-7 py-9 rounded-2xl min-h-[300px]'>
                    <Image 
                        source={images.check}
                        className='w-[110px] h-[110px] mx-auto my-5'
                        resizeMode='contain'
                    />
                    <Text className='text-3xl font-JakartaBold text-center'>
                        Verified!
                    </Text>
                    <Text className='text-base text-gray-400 font-Jakarta, text-center mt-2'>
                        You have successfully verified your account.
                    </Text>

                    <CustomButton 
                        title='Browse Home'
                        onPress={() => {router.push('/(root)/(tabs)/home')}}
                        className='mt-5'
                    />
                </View>
            </ReactNativeModal>
        </View>
    </ScrollView>
  )
}

export default SignUp