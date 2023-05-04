import { useEffect, useState } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { MMKV, useMMKVObject, useMMKV } from 'react-native-mmkv';

import { styles } from './styles'


// const storage = new MMKV({ id: 'myappdblocal'})

type User = {
  name: string;
  email: string;
}

export default function App() {

  const [name, setName] = useState('');
  const [email,setEmail] = useState('');

  const [user, setUser] = useMMKVObject<User>('user');
  const storage = useMMKV({ id: 'myappdblocal'});


  function handleSave() {
    setUser({name, email});
  }

  function fetchUser() {
    const data = storage.getString('user');
    setUser(data ? JSON.parse(data) : {});
  }

  useEffect(() =>{
    const listener = storage.addOnValueChangedListener((changeKey) => {
      const newValue = storage.getString(changeKey);

      console.log('Novo valor =>', newValue);
      fetchUser();
    });

    return () => listener.remove(); // importante

  }, [])

  return (
    <View style={styles.container}>

      <TextInput 
        placeholder='Nome...' 
        style={styles.input}
        onChangeText={setName}
      />

      <TextInput 
        placeholder='E-mail...' 
        style={styles.input}  
        onChangeText={setEmail}
      />

      <Button 
        title='Salvar' 
        onPress={handleSave} 
      />

      <Text>{user?.name} - {user?.email}</Text>

    </View>
  );
}


