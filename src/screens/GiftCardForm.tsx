import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import BaseButton from '../components/BaseButton';
import CardLabel from '../components/CardLabel';
import { addGiftCard } from '../store/slices/giftCardSlice';
import { handleError, ErrorType } from '../utils/errorHandling';

const CardInfoSection = styled.View`
  gap: 8px;
`;

const GiftCardFormScreen = ({ navigation, route }: any): React.ReactElement => {
  const { card, readonly } = route.params || {};

  const [name, setName] = useState(card?.name || '');
  const [code, setCode] = useState(card?.code || '');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    navigation.setOptions({
      title: readonly ? 'Gift Card Details' : 'Add Gift Card',
    });
  }, [readonly, navigation]);

  const validateInputs = useCallback(() => {
    if (!name.trim()) {
      handleError(new Error('Name is required'), 'VALIDATION_ERROR' as ErrorType, 'Please enter a card name.');
      return false;
    }
    if (!code.trim()) {
      handleError(new Error('Code is required'), 'VALIDATION_ERROR' as ErrorType, 'Please enter a card code.');
      return false;
    }
    return true;
  }, [name, code]);

  const onSave = async () => {
    if (!validateInputs()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const newCard = {
        id: uuidv4(),
        name: name.trim(),
        code: code.trim(),
      };

      dispatch(addGiftCard(newCard));

      const existingCards = await AsyncStorage.getItem('@giftCards');
      const cards = existingCards ? JSON.parse(existingCards) : [];
      await AsyncStorage.setItem('@giftCards', JSON.stringify([...cards, newCard]));

      Alert.alert('Success', 'Gift card has been saved.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      handleError(error, 'STORAGE_ERROR' as ErrorType, 'Failed to save gift card. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                testID="save-button"
                title="Save"
                onPress={onSave}
                disabled={!name || !code || isLoading}
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
