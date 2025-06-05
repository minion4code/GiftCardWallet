import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface BaseButtonProps {
  testID?: string;
  onPress: () => void;
  title: string;
  disabled?: boolean;
}

const BaseButton = ({ testID, onPress, disabled, title }: BaseButtonProps) => {
  return (
    <TouchableOpacity
      testID={testID}
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.buttonContainer,
        { backgroundColor: disabled ? "#B0B1B4" : "#205DD3" },
      ]}
    >
      <Text style={styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default BaseButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 28,
  },
});
