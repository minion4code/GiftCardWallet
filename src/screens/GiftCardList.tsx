import React, { useEffect, useCallback, memo } from 'react';
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
import { handleError, ErrorType } from '../utils/errorHandling';

const ITEM_HEIGHT = 76; // height of rowFront + marginBottom

const GiftCardItem = memo(({ item, onPress }: { item: any; onPress: (item: any) => void }) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={() => onPress(item)}
  >
    <View style={styles.rowFront}>
      <Text style={styles.cardText}>{item.name} - {item.code}</Text>
    </View>
  </TouchableOpacity>
));

export const HiddenItem = memo(({ item, onDelete }: { item: any; onDelete: (id: string) => void }) => (
  <View style={styles.rowBack}>
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.8}
      style={styles.deleteButton}
      onPress={() => onDelete(item.id)}
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
    </TouchableOpacity>
  </View>
));

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
        handleError(error, 'STORAGE_ERROR' as ErrorType, 'Failed to load gift cards. Please try again.');
      }
    };

    loadGiftCards();
  }, [dispatch]);

  const confirmDelete = useCallback((id: string) => {
    Alert.alert(
      'Delete Gift Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              dispatch(removeCard(id));
              // Update AsyncStorage after successful deletion
              const updatedCards = giftCards.filter(card => card.id !== id);
              await AsyncStorage.setItem('@giftCards', JSON.stringify(updatedCards));
            } catch (error) {
              handleError(error, 'STORAGE_ERROR' as ErrorType, 'Failed to delete gift card. Please try again.');
            }
          },
        },
      ]
    );
  }, [dispatch, giftCards]);

  const handleCardPress = useCallback((card: any) => {
    navigation.navigate('GiftCardForm', {
      card,
      readonly: true,
    });
  }, [navigation]);

  const getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const renderItem = useCallback(({ item }: any) => (
    <GiftCardItem item={item} onPress={handleCardPress} />
  ), [handleCardPress]);

  const renderHiddenItem = useCallback(({ item }: any) => (
    <HiddenItem item={item} onDelete={confirmDelete} />
  ), [confirmDelete]);

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
          getItemLayout={getItemLayout}
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
