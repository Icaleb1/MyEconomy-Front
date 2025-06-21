import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LimiteModal({ visible, onClose, onSalvar, valorAtual }) {
  const [novoValor, setNovoValor] = useState(valorAtual?.toString() || '');

  useEffect(() => {
    setNovoValor(valorAtual?.toString() || '');
  }, [valorAtual]);

  const handleSalvar = () => {
    const valorNum = parseFloat(novoValor.replace(',', '.'));
    if (isNaN(valorNum)) return;
    onSalvar(valorNum);
    setNovoValor('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Editar Limite</Text>

          <Text style={styles.label}>Valor (R$):</Text>
          <TextInput
            style={styles.input}
            value={novoValor}
            onChangeText={setNovoValor}
            keyboardType="numeric"
            placeholder="Digite o valor"
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSalvar} style={[styles.button, styles.saveButton]}>
              <Text style={styles.buttonTextSave}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center'
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#555'
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#222',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '45%',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#3578E5',
  },
  buttonTextCancel: {
    color: '#555',
    fontWeight: '600',
  },
  buttonTextSave: {
    color: '#fff',
    fontWeight: '700',
  },
});
