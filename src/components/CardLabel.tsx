import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface CardLabelProps {
  title: string;
}

const CardLabel = ({ title }: CardLabelProps) => {
  return <Text style={styles.label}>{title}</Text>;
};

export default CardLabel;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
