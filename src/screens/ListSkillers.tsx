import {
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  LogBox,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Coracao from '../assets/svg/Vector.svg';
import ZapZap from '../assets/svg/Whatsapp.svg';
import React, { useEffect, useState } from 'react';
import { Card, Text, Divider } from 'react-native-paper';
import useCollection from '../hooks/useCollection';
import useDocument, { UserType } from '../hooks/useDocument';
import useUserData from '../hooks/useUserData';
import useAuth from '../hooks/useAuth';
import { House } from 'phosphor-react-native';
import { Loading } from '../components/Loading';

export function ListSkillers() {
  const { navigate } = useNavigation();
  const [filterText, setFilterText] = useState('');
  const { allDates } = useCollection<UserType>('users');
  const [data, setData] = useState<any | UserType>([{}]);
  const [filteredData, setFilteredData] = useState(data);
  const { getUserData } = useDocument('users');
  const [userData, setUserData] = useState<any | UserType>({});
  const { saveDate } = useUserData('users');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  async function updateData() {
    setLoading(true);
    const data = await allDates();
    const supply: Array<UserType> = data.filter(
      (value) => value.skills?.length
    );
    setFilteredData(supply);
    setData(supply);

    if (user?.uid) {
      const userDataGet = await getUserData(user.uid);
      setUserData(userDataGet);
      console.log('user data', userDataGet);
    }
    setLoading(false);
  }

  function handleAddFavorite(favoriteID: string) {
    if (!userData) {
      return; // Retorna se userData for nulo
    }

    const array = userData.favorite || [];
    array.push(favoriteID);

    const userToUpdate = {
      id: user?.uid!!,
      name: userData.name,
      email: userData.email,
      biography: userData.bio,
      zap: userData.zap,
      link: userData.link,
      price: userData.price,
      skills: userData.skills,
      favorite: array,
    };

    saveDate(userToUpdate).catch(console.error);
  }

  function handleFilter() {
    console.log('filterText:', filterText);

    if (filterText.length > 1) {
      const filteredAux = data.filter((e: UserType) => {
        return (
          (e.zap && e.zap.includes(filterText)) ||
          (e.name && e.name.includes(filterText)) ||
          (e.bio && e.bio.includes(filterText))
        );
      });
      setFilteredData(filteredAux);
    } else {
      console.log('setFilteredData');
      setFilteredData(data);
    }
  }

  useEffect(() => {
    updateData().catch(console.error);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, [user]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <View className='flex-col h-auto w-full bg-sky-500'>
          <View className='p-4 h-auto '>
            <View className='w-full flex-row justify-start'>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigate('home')}
              >
                <House size={32} color='#f7f7f7' />
              </TouchableOpacity>
            </View>
            <View className='my-4 w-52 text-3xl leading-8 flex-col '>
              <Text className='font-ArchivoBold text-white text-3xl'>
                Skillers
              </Text>
              <Text className='font-ArchivoBold text-white text-3xl'>
                Disponíveis
              </Text>
            </View>
            <KeyboardAvoidingView
              className='flex-col m-2 border-b-gray-400'
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Ajuste esse valor conforme necessário
            >
              <TextInput
                editable
                value={filterText}
                placeholder='Filtrar por dia, matéria'
                placeholderTextColor='#fff'
                keyboardType='default'
                className='opacity-90 text-white decoration-'
                onChangeText={(newValue) => {
                  setFilterText(newValue);
                  handleFilter();
                }}
              />
            </KeyboardAvoidingView>
            <Divider />
          </View>

          <SafeAreaView>
            <View className='w-full px-4 pb-5 mb-96 bg-[#f0f0f7]'>
              {filteredData.length > 0 ? (
                <FlatList
                  data={filteredData}
                  renderItem={({ item, index }) => (
                    <Card
                      className='p-0 w-90 pb-3 bg-white mb-5 mt-2'
                      key={index}
                    >
                      <View className='p-5'>
                        <Text className='text-[#32264d] font-PoppinsRegular font-bold text-2xl'>
                          {item.name}
                        </Text>
                        <Text variant='titleSmall'>{item.skills}</Text>
                      </View>
                      {/* <Card.Title title="Roberval dos Santos" subtitle="Acadêmico, 3º período - UTFPR"/> */}
                      <Card.Content className='mb-2 mt-5'>
                        <Text className='mb-5' variant='bodyMedium'>
                          {item.bio}
                        </Text>

                        <Text className='mb-5' variant='bodyMedium'>
                          {`Por aqui : ${item.link}`}
                        </Text>
                        <Divider className='m-2 w-full' />
                        <View className='flex-row justify-center mt-5'>
                          <Text className='mr-3'>Preço/hora</Text>
                          <Text className='text-sky-500 text-bold'>
                            {`R$ ${item.price}`}
                          </Text>
                        </View>
                      </Card.Content>
                      <Card.Actions className='flex justify-center bg-[#fafafc]'>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          className='flex w-18 bg-sky-300 rounded-md justify-center p-3.5'
                          onPress={() => handleAddFavorite(item.id)}
                        >
                          <Coracao />
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          className='flex-1 flex-row flex bg-green-900 rounded-md justify-center'
                          onPress={() => navigate('home')}
                        >
                          <Text className='text-white ml-3 p-3 text-base font-PoppinsRegular'>
                            {' '}
                            <ZapZap /> Entrar em contato
                          </Text>
                        </TouchableOpacity>
                      </Card.Actions>
                    </Card>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                <View className='flex items-center justify-center h-full w-full bg-white'>
                  <Text className='text-[#57534E] my-10 p-4 w-full h-auto'>
                    <Text className='font-ArchivoBold  text-2xl'>
                      Os melhores skillers
                    </Text>
                    {'\n'}
                    <Text className='font-ArchivoBold text-2xl '>
                      aparecerão
                    </Text>
                    {'\n'}
                    <Text className='font-ArchivoBold text-2xl '>aqui!!</Text>
                  </Text>
                </View>
              )}
            </View>
          </SafeAreaView>
        </View>
      )}
    </>
  );
}
