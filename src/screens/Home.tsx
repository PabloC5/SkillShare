import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EnvelopeSimple, Lock, XCircle } from 'phosphor-react-native';

import BannerHome from '../assets/svg/banner-home.svg';
import ToWatch from '../assets/svg/to-watch.svg';
import ToStudy from '../assets/svg/to-study.svg';
import { useState } from 'react';
import useDocument, { User } from '../hooks/useDocument';
import { validate } from 'email-validator';
import useAuth from '../hooks/useAuth';

export function Home() {
  const { navigate } = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth<User>('users');

  const handleLoginUser = async () => {
    try {
      if (!validate(email)) {
        setError(true);
        return;
      }

      if (password == '') {
        setError(true);
        return;
      }

      try {
        await login(email, password);
        console.log('Login com sucesso');
        setModalVisible(!modalVisible);
        setError(false);
        setEmail('');
        setPassword('');
        navigate('student');
      } catch (error) {
        setError(true);
        console.log('Email ou senhas estão incorretos',error);
      }
    } catch (error) {
      console.error('Erro ao fazer login');
    }
  };

  return (
    <View className='flex items-center justify-center h-full  bg-sky-500 '>
      <ScrollView className='mt-20 '>
        <View className='flex justify-center items-center mx-auto'>
          <BannerHome width={280} />
        </View>

        <View className='mx-4'>
          <Text className='text-white my-4 w-52 text-xl leading-8'>
            <Text className=''>Seja bem-vindo !</Text>
            {'\n'}
            <Text className='font-ArchivoBold '>O que deseja fazer ?</Text>
          </Text>

          <View className='flex-row justify-between h-32 font-PoppinsSemiBold text-xl '>
            <Modal
              animationType='fade'
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}
            >
              <View className='flex items-center justify-start h-screen mt-14'>
                <View className=' flex bg-white w-60 h-64 rounded-lg '>
                  <View className='mt-2 mr-3'>
                    <View className='flex-row items-center justify-center'>
                      <Text className='font-PoppinsMedium text-xl'>Login</Text>
                      <TouchableOpacity
                        className='absolute right-0'
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <XCircle size={24} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className='flex justify-center items-center gap-4 mt-1'>
                    <View className='flex-row items-center gap-x-2 border rounded-md border-dark-50 w-48'>
                      <EnvelopeSimple size={20} />
                      <TextInput
                        placeholder='Digite seu e-mail'
                        value={email}
                        onChangeText={setEmail}
                        className='w-full'
                      ></TextInput>
                    </View>

                    <View className='flex-row items-center gap-x-2 border rounded-md border-dark-50 w-48'>
                      <Lock size={20} />

                      <TextInput
                        secureTextEntry
                        placeholder='*****************'
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        underlineColorAndroid='transparent'
                        autoCapitalize='none'
                        className='w-full'
                      />
                    </View>

                    <TouchableOpacity
                      onPress={handleLoginUser}
                      className='w-48 h-7 border rounded-md items-center justify-center'
                    >
                      <Text className=' '>Entrar</Text>
                    </TouchableOpacity>

                    {error && (
                      <Text className='text-[#EF3333] text-base text-center font-medium'>
                        Email ou senha está incorreto!
                      </Text>
                    )}

                    <TouchableOpacity
                      onPress={() => {
                        navigate('register');
                        setModalVisible(!modalVisible);
                      }}
                    >
                      <Text className='text-sky-500 font-ArchivoBold'>
                        Não possui conta ? Crie uma agora!
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              activeOpacity={0.7}
              className='flex w-28 justify-between items-start p-4 rounded-lg bg-sky-200 '
              onPress={() => setModalVisible(!modalVisible)}
            >
              <ToStudy />

              <Text className='font-semibold text-xl font-ArchivoSemiBold text-stone-600 '>
                Estudar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className='flex w-28 justify-between items-start p-4 rounded-lg bg-[#F27C7C] '
              onPress={() => navigate('professor')}
            >
              <ToWatch />
              <Text className='font-semibold text-xl font-ArchivoSemiBold text-white'>
                Dar aulas
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigate('enterpriseLanding')}>
            <Text className='my-5 text-white leading-4 font-bold'>
              <Text>Seja parceiro SkillShare</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
