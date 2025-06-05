import React, { useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setGiftCards, removeCard } from '../store/slices/giftCardSlice';

const GiftCardListScreen = ({ navigation }: any) => {
  const giftCards = useSelector((state: RootState) => state.giftCard.cards);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadGiftCards = async () => {
      try {
        const saved = await AsyncStorage.getItem('@giftCards');
        if (giftCards.length === 0 && saved) {
          const parsed = JSON.parse(saved);
          dispatch(setGiftCards(parsed));
        }
      } catch (error) {
        console.error('Failed to load gift cards:', error);
      }
    };
  
    loadGiftCards();
  }, [dispatch]);

  const confirmDelete = (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this card?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(removeCard(id)),
      },
    ]);
  };

  const handleCardPress = (card: any) => {
    navigation.navigate('GiftCardForm', {
      card,
      readonly: true,
    });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => handleCardPress(item)}
    >
      <View style={styles.rowFront}>
        <Text style={styles.cardText}>{item.name} - {item.code}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = ({ item }: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.deleteButton}
        onPress={() => confirmDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="card-outline" size={64} color="#999" />
      <Text style={styles.emptyText}>No Gift Cards added yet</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <SwipeListView
          data={giftCards}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={renderEmptyList}
        />
      </View>
    </SafeAreaView>
  );
};

export default GiftCardListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    padding: 16,
  },
  rowFront: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ff4d4f',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    marginBottom: 12,
    borderRadius: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#1e1e1e',
    fontWeight: '600',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 12,
  },
  emptyContainer: {
    marginTop: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});
