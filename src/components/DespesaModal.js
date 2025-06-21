import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { mostrarToast } from "../components/Toast";
import { editarDespesa } from "../service/DespesaService";

export default function DespesaModal({ visible, onClose, despesa, onDespesaAtualizada }) {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (despesa) {
      setValor(despesa.valor.toString());
      setDescricao(despesa.descricao);
    }
  }, [despesa]);

  const validarCampos = () => {
    const valorNum = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNum) || valorNum <= 0) {
      mostrarToast('error', 'Erro', 'O valor deve ser maior que zero.');
      return false;
    }
    if (!descricao.trim()) {
      mostrarToast('error', 'Erro', 'Descrição não pode ser vazia.');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    try {
      const valorNum = parseFloat(valor.replace(',', '.'));
      const dadosAtualizados = {
        valor: valorNum,
        descricao: descricao.trim()
      };

      const resp = await editarDespesa(despesa.id, dadosAtualizados);
      onDespesaAtualizada(resp);
      mostrarToast('success', 'Sucesso', 'Despesa atualizada com sucesso.');
      onClose();
    } catch (error) {
      mostrarToast('error', 'Erro', error.message || 'Falha ao editar despesa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Editar Despesa</Text>

          <Text style={styles.label}>Valor (R$):</Text>
          <TextInput
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
            style={styles.input}
            placeholder="Digite o valor"
          />

          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            value={descricao}
            onChangeText={setDescricao}
            style={styles.input}
            placeholder="Digite a descrição"
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSalvar} style={[styles.button, styles.saveButton]} disabled={loading}>
              <Text style={styles.buttonTextSave}>{loading ? 'Salvando...' : 'Salvar'}</Text>
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
