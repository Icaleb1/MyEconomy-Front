import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Footer from '../components/Footer';
import { buscarLimite, criarLimite } from "../service/LimiteService";
import { LimiteDTO } from "../model/DTOs/LimiteDto";
import { mostrarToast } from "../components/Toast";
import Input from '../components/Input';
import InputSelect from '../components/InputSelect';

export default function Limite({ navigation }) {
    const [valor, setValor] = useState('');
    const [mesCadastro, setMesCadastro] = useState('');
    const [mesBusca, setMesBusca] = useState('');
    const [limiteBuscado, setLimiteBuscado] = useState(null);

    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear();

    const mesesParaCadastro = Array.from({ length: 12 }, (_, i) => i + 1).filter(mes => mes >= mesAtual);
    const mesesParaBusca = Array.from({ length: 12 }, (_, i) => i + 1);

    const formatMeses = (meses) =>
        meses.map(mes => ({
            label: new Date(anoAtual, mes - 1).toLocaleString('pt-BR', { month: 'long' }),
            value: mes.toString()
        }));

    const handleSalvar = async () => {
        const valorNum = parseFloat(valor.replace(',', '.'));
        const mesNum = parseInt(mesCadastro);

        if (isNaN(valorNum) || !mesCadastro) {
            mostrarToast("error", "Erro", "Preencha todos os campos corretamente.");
            return;
        }

        const mesReferencia = `${String(mesNum).padStart(2, '0')}-01-${anoAtual}`;
        const limite = new LimiteDTO(mesReferencia, valorNum);

        try {
            await criarLimite(limite.toJSON());
            mostrarToast("success", "Limite criado!", "Seu limite foi salvo com sucesso.");
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
                <Text style={styles.title}>Gerenciar Limites 💸</Text>

                <Input
                    label="Valor (R$):"
                    value={valor}
                    onChangeText={setValor}
                    placeholder="Ex: 1500.00"
                    keyboardType="numeric"
                />

                <InputSelect
                    label="Mês para Cadastro:"
                    selectedValue={mesCadastro}
                    onValueChange={setMesCadastro}
                    options={formatMeses(mesesParaCadastro)}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>

                <InputSelect
                    label="Mês para Busca:"
                    selectedValue={mesBusca}
                    onValueChange={setMesBusca}
                    options={formatMeses(mesesParaBusca)}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleBuscarLimite}>
                    <Text style={styles.saveButtonText}>Buscar Limite</Text>
                </TouchableOpacity>

                {limiteBuscado !== null && (
                    <Text style={styles.resultado}>
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
    container: { flex: 1, backgroundColor: "#F2C4B3", alignItems: 'center' },
    scrollContainer: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 100 },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: "#010440",
        marginBottom: 30,
        textAlign: 'center'
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
    resultado: {
        fontSize: 16,
        color: "#010440",
        marginTop: 10,
        textAlign: 'center'
    }
});
