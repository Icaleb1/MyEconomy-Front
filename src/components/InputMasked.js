import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

export default function InputMasked({ label, value, onChange, type, options, error, ...props }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInputMask
        type={type}
        options={options}
        style={[styles.input, error && { borderColor: 'red' }]}
        value={value}
        onChangeText={onChange}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    width: 350,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: "#010440",
    fontSize: 18,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: "#f2DCF1",
    borderWidth: 2,
    borderColor: "#1B0273",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "black",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
    alignSelf: "flex-start",
  },
});
