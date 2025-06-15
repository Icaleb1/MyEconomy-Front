import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const InputSelect = ({ label, selectedValue, onValueChange, options, placeholder = "Selecione uma opção" }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
        >
          <Picker.Item label={placeholder} value="" />
          {options.map(({ label, value }) => (
            <Picker.Item key={value} label={label} value={value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default InputSelect;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#010440",
    marginBottom: 5,
    fontWeight: 'bold',
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: "#1B0273",
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: "#f2DCF1",
  },
});
