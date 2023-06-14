import {
  TouchableOpacity,
  View,
  SafeAreaView,
  LogBox,
  FlatList,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CoracaoBarrado from '../assets/svg/coracao_barras.svg';
import ZapZap from '../assets/svg/Whatsapp.svg';
import React, { useEffect, useState } from 'react';
import { Card, Text, Divider } from 'react-native-paper';
import { House } from 'phosphor-react-native';
import useDocument, { UserType } from '../hooks/useDocument';
import useUserData from '../hooks/useUserData';
import useCollection from '../hooks/useCollection';
import useAuth from '../hooks/useAuth';
import { Loading } from '../components/Loading';

export default function Favorite() {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | UserType>([{}]);
  const { getUserData } = useDocument('users');

  const [userData, setUserData] = useState<any | UserType>({});
  const { removeFavorite } = useUserData('users');
  const { allDates } = useCollection<UserType>('users');
  const { user } = useAuth();

  async function updateData() {
    const data = await allDates();
    console.log(data);
    setLoading(true);
    if (user?.uid) {
      const userDataGet = await getUserData(user.uid);
      setUserData(userDataGet);
      console.log(userDataGet);
      const supply: Array<UserType> = data.filter((item) =>
        userDataGet?.favorites?.includes(item.id)
      );
      setData(supply);
    }
    setLoading(false);
  }

  async function handleRemoveFavorite(favId: string) {
    await removeFavorite(user?.uid, favId).catch(console.error);
    await updateData();
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
      await updateData();
      setLoading(false);
    };

    fetchData().catch(console.error);
  }, [user]);

  function confirmRemoveFavorite(favoriteID: string, skillerName: string) {
    Alert.alert('Atenção!', `Deseja remover ${skillerName} dos favoritos?`, [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Remover', onPress: () => handleRemoveFavorite(favoriteID)},
    ]);
  }

  function confirmRedirectZap(skillerZap: string, skillerName: string) {
    let welcomeZap = `Olá, encontrei seu cadastro no aplicativo Skillshare e gostaria de aprender com você. \nQuando podemos agendar uma aula ?`
    Alert.alert('Atenção!', `Deseja iniciar uma conversa no whatsapp ${skillerName}`, [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Prosseguir', onPress: () => Linking.openURL(`https://wa.me/55${skillerZap}?text=${welcomeZap}`)},
    ]);
  }

  function confirmGoogle(meetLink: string, skillerName: string) {
    Alert.alert('Atenção!', `Deseja entrar em chamada no meet de ${skillerName}`, [
      {
        text: 'Cancelar',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Sim', onPress: () => Linking.openURL(meetLink)},
    ]);
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <View className='flex-col justify-start h-full w-full bg-sky-500'>
          <View className='p-4'>
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
                Meus Skillers
              </Text>
              <Text className='font-ArchivoBold text-white text-3xl'>
                Favoritos
              </Text>
            </View>
          </View>

          <SafeAreaView>
            <View className='w-full h-full px-4 pb-40 bg-[#f0f0f7]'>
              {data.length > 0 ? (
                <FlatList
                  data={data}
                  renderItem={({ item, index }) => (
                    <Card
                      className='p-0 w-90 pb-3 bg-white mb-5 mt-2'
                      key={index}
                    >
                      <View className='p-5'>
                        <Text className='text-[#32264d] font-PoppinsRegular font-bold text-2xl'>
                          {item?.name}
                        </Text>
                        <Text variant='titleSmall'>{item?.skills}</Text>
                      </View>
                      {/* <Card.Title title="Roberval dos Santos" subtitle="Acadêmico, 3º período - UTFPR"/> */}
                      <Card.Content className='mb-2 mt-5'>
                        <Text className='mb-5' variant='bodyMedium'>
                          {item?.bio}
                        </Text>
                        <Text className='mb-5' variant='bodyMedium' onPress={() => {confirmGoogle   (item.link, item.name)}}>
                          <Text>
                            {`Por aqui: `}
                          </Text>
                          <Text>
                            {item.link}
                          </Text>
                        </Text>
                        <Divider className='m-2 w-full' />
                        <View className='flex-row justify-center mt-5'>
                          <Text className='mr-3'>Preço/hora</Text>
                          <Text className='text-sky-500 text-bold'>
                            {`R$ ${item?.price}`}
                          </Text>
                        </View>
                      </Card.Content>
                      <Card.Actions className='flex justify-center bg-[#fafafc]'>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          className='flex w-18 bg-red-500 rounded-md justify-center p-3.5'
                          onPress={() => confirmRemoveFavorite(item.id, item.name)}
                        >
                          <CoracaoBarrado />
                        </TouchableOpacity>
                        <TouchableOpacity
                          className='flex-1 flex-row flex bg-green-900 rounded-md justify-center'
                          onPress={() => confirmRedirectZap(item.zap, item.name)}
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
                      Seus favoritos
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
