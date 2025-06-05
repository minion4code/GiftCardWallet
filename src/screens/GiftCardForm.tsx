import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  TextInput,
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { v4 as uuidv4 } from 'uuid';
import BaseButton from '../components/BaseButton';
import CardLabel from '../components/CardLabel';
import { addGiftCard } from '../store/slices/giftCardSlice';

const CardInfoSection = styled.View`
  gap: 8px;
`;

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.mainContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, gap: 12 }}>
              <CardInfoSection>
                <CardLabel title="Card Name" />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.cardInfoInput}
                  editable={!readonly}
                  placeholder="Enter card name"
                  autoCorrect={false}
                  autoCapitalize="none"
                  autoComplete="off"
                />
              </CardInfoSection>
              <CardInfoSection>
                <CardLabel title="Card Code" />
                <TextInput
                  value={code}
                  onChangeText={setCode}
                  style={styles.cardInfoInput}
                  editable={!readonly}
                  placeholder="Enter card code"
                  autoCorrect={false}
                  autoCapitalize="none"
                  autoComplete="off"
                  keyboardType="numeric"
                />
              </CardInfoSection>
            </View>
            {!readonly && (
              <BaseButton
                title="Save"
                onPress={handleAdd}
                disabled={!name || !code}
              />
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GiftCardFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flexGrow: 1,
    padding: 16,
    gap: 24,
    justifyContent: 'space-between',
  },
  cardInfoInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    fontSize: 16,
    padding: 8,
  },
});
