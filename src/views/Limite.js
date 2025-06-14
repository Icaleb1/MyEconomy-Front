import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Footer from '../components/Footer';
import { buscarLimite, criarLimite } from "../service/LimiteService";
import { LimiteDTO } from "../model/DTOs/LimiteDto";
import { mostrarToast } from "../components/Toast";

export default function Limite({ navigation }) {
    const [valor, setValor] = useState('');
    const [mesCadastro, setMesCadastro] = useState('');
    const [mesBusca, setMesBusca] = useState('');
    const [limiteBuscado, setLimiteBuscado] = useState(null);

    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();

    const mesesParaCadastro = Array.from({ length: 12 }, (_, i) => i + 1).filter(mes => mes >= mesAtual);
    const mesesParaBusca = Array.from({ length: 12 }, (_, i) => i + 1);

    const handleSalvar = async () => {
        const valorNum = parseFloat(valor.replace(',', '.'));
        const mesNum = parseInt(mesCadastro);

        if (isNaN(valorNum) || !mesCadastro) {
            mostrarToast("error", "Erro", "Preencha todos os campos corretamente.");
            return
        }

        const mesReferencia = `${String(mesNum).padStart(2, '0')}-01-${anoAtual}`;
        const limite = new LimiteDTO(mesReferencia, valorNum);

        try {
            await criarLimite(limite.toJSON());
            mostrarToast("success", "Limite criado!", "Seu limite foi salvo com sucesso.");
            navigation.goBack();
        } catch (error) {
            mostrarToast("error", "Erro ao criar limite", error.message || "Tente novamente mais tarde.");
        }
    };

    const handleBuscarLimite = async () => {
        const mesNum = parseInt(mesBusca);

        if (!mesBusca || isNaN(mesNum)) {
            mostrarToast("error", "Erro", "Selecione um mês válido.");
            return;
        }

        try {
            const limite = await buscarLimite(mesNum, anoAtual);
            if (limite) {
                setLimiteBuscado(limite.valor);
                mostrarToast("success", "Limite encontrado", `R$ ${limite.valor}`);
            } else {
                setLimiteBuscado(null);
                mostrarToast("info", "Sem limite", "Nenhum limite cadastrado para esse mês.");
            }
        } catch (error) {
            mostrarToast("error", "Erro", error.message || "Falha ao buscar limite.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Criar Limite 💸</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Valor (R$):</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Ex: 1500.00"
                        value={valor}
                        onChangeText={setValor}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mês para Cadastro:</Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={mesCadastro}
                            onValueChange={(itemValue) => setMesCadastro(itemValue)}
                        >
                            <Picker.Item label="Selecione um mês" value="" />
                            {mesesParaCadastro.map(mes => (
                                <Picker.Item
                                    key={mes}
                                    label={new Date(anoAtual, mes - 1).toLocaleString('pt-BR', { month: 'long' })}
                                    value={mes.toString()}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mês para Busca:</Text>
                    <View style={styles.picker}>
                        <Picker
                            selectedValue={mesBusca}
                            onValueChange={(itemValue) => setMesBusca(itemValue)}
                        >
                            <Picker.Item label="Selecione um mês" value="" />
                            {mesesParaBusca.map(mes => (
                                <Picker.Item
                                    key={mes}
                                    label={new Date(anoAtual, mes - 1).toLocaleString('pt-BR', { month: 'long' })}
                                    value={mes.toString()}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleBuscarLimite}>
                    <Text style={styles.saveButtonText}>Buscar Limite</Text>
                </TouchableOpacity>

                {limiteBuscado !== null && (
                    <Text style={{ fontSize: 16, color: "#010440", marginTop: 10, textAlign: 'center' }}>
                        Limite para o mês selecionado: {limiteBuscado.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}
                    </Text>
                )}
            </ScrollView>

            <Footer navigation={navigation} currentScreen="limite" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F2C4B3" },
    scrollContainer: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
    title: {
        fontSize: 28, fontWeight: 'bold', color: "#010440", marginBottom: 30, textAlign: 'center'
    },
    inputGroup: { marginBottom: 20 },
    label: {
        fontSize: 16, color: "#010440", marginBottom: 5, fontWeight: 'bold'
    },
    input: {
        height: 50,
        backgroundColor: "#f2DCF1",
        borderWidth: 2,
        borderColor: "#1B0273",
        borderRadius: 5,
        paddingHorizontal: 15,
        color: "#010440",
        fontSize: 16,
    },
    picker: {
        borderWidth: 2,
        borderColor: "#1B0273",
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: "#f2DCF1"
    },
    saveButton: {
        backgroundColor: "#5288F2",
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: "#1B0273",
        marginTop: 10,
    },
    saveButtonText: {
        color: "#F2F2F2",
        fontSize: 18,
        fontWeight: 'bold',
    },
});
