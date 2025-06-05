import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  Button,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addGiftCard } from '../store/slices/giftCardSlice';

const GiftCardFormScreen = ({ navigation, route }: any): React.ReactElement => {
  const { card, readonly } = route.params || {};

  const [name, setName] = useState(card?.name || '');
  const [code, setCode] = useState(card?.code || '');
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.setOptions({
      title: readonly ? 'Gift Card Details' : 'Add Gift Card',
    });
  }, [readonly, navigation]);

  const handleAdd = () => {
    if (!name || !code) return;

    dispatch(
      addGiftCard({
        id: uuidv4(),
        name,
        code,
      })
    );

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.label}>Card Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          editable={!readonly}
        />
        <Text style={styles.label}>Card Code</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          style={styles.input}
          editable={!readonly}
        />
        {!readonly && (
          <Button title="Add Card" onPress={handleAdd} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default GiftCardFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 16,
  },
  label: { marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});
