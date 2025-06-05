import React from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { removeCard } from '../store/slices/giftCardSlice';

const GiftCardListScreen = ({ navigation }: any) => {
  const giftCards = useSelector((state: RootState) => state.giftCard.cards);
  const dispatch = useDispatch();

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
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <View style={styles.rowFront}>
        <Text style={styles.cardText}>{item.name} - {item.code}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = ({ item }: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
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
        />
      </View>
    </SafeAreaView>
  );
};

export default GiftCardListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 16,
  },
  rowFront: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 20,
    marginBottom: 10,
    borderRadius: 8,
  },
  cardText: {
    fontSize: 16,
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
