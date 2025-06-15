import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';
import Footer from '../components/Footer';
import { criarDespesa, buscarDespesas } from "../service/DespesaService";
import { DespesaDTO } from "../model/DTOs/DespesaDto";
import { mostrarToast } from "../components/Toast";
import Input from '../components/Input';
import InputSelect from '../components/InputSelect';

export default function Despesa({ navigation }) {
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [mesCadastro, setMesCadastro] = useState('');
    const [mesBusca, setMesBusca] = useState('');
    const [despesas, setDespesas] = useState([]);

    const anoAtual = new Date().getFullYear();
    const mesAtual = new Date().getMonth() + 1;

    const mesesParaCadastro = Array.from({ length: 12 }, (_, i) => i + 1).filter(m => m >= mesAtual);
    const mesesParaBusca = Array.from({ length: 12 }, (_, i) => i + 1);

    const formatMeses = (meses) =>
        meses.map(mes => ({
            label: new Date(anoAtual, mes - 1).toLocaleString('pt-BR', { month: 'long' }),
            value: mes.toString()
        }));

    const handleSalvar = async () => {
        const valorNum = parseFloat(valor.replace(',', '.'));
        const mesNum = parseInt(mesCadastro);

        if (!descricao || isNaN(valorNum) || !mesCadastro) {
            mostrarToast("error", "Erro", "Preencha todos os campos corretamente.");
            return;
        }

        const mesReferencia = `${String(mesNum).padStart(2, '0')}-01-${anoAtual}`;
        const novaDespesa = new DespesaDTO(mesReferencia, valorNum, descricao);

        try {
            await criarDespesa(novaDespesa.toJSON());
            mostrarToast("success", "Despesa criada!", "Sua despesa foi salva com sucesso.");
            setValor('');
            setDescricao('');
        } catch (error) {
            mostrarToast("error", "Erro ao criar despesa", error.message || "Tente novamente mais tarde.");
        }
    };

    const handleBuscarDespesas = async () => {
        const mesNum = parseInt(mesBusca);
        if (!mesBusca || isNaN(mesNum)) {
            mostrarToast("error", "Erro", "Selecione um mês válido.");
            return;
        }

        try {
            const resultado = await buscarDespesas(mesNum, anoAtual);
            setDespesas(resultado || []);
            if (resultado.length === 0) {
                mostrarToast("info", "Nenhuma despesa", "Nenhuma despesa cadastrada neste mês.");
            } else {
                mostrarToast("success", "Despesas encontradas", `${resultado.length} despesas listadas.`);
            }
        } catch (error) {
            mostrarToast("error", "Erro ao buscar", error.message || "Falha ao buscar despesas.");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Gerenciar Despesas 🧾</Text>

                <Input
                    label="Valor (R$):"
                    value={valor}
                    onChangeText={setValor}
                    placeholder="Ex: 250.00"
                    keyboardType="numeric"
                />

                <Input
                    label="Descrição:"
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Ex: Supermercado"
                />

                <InputSelect
                    label="Mês para Cadastro:"
                    selectedValue={mesCadastro}
                    onValueChange={setMesCadastro}
                    options={formatMeses(mesesParaCadastro)}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
                    <Text style={styles.saveButtonText}>Salvar Despesa</Text>
                </TouchableOpacity>

                <InputSelect
                    label="Mês para Busca:"
                    selectedValue={mesBusca}
                    onValueChange={setMesBusca}
                    options={formatMeses(mesesParaBusca)}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleBuscarDespesas}>
                    <Text style={styles.saveButtonText}>Buscar Despesas</Text>
                </TouchableOpacity>

                {despesas.length > 0 && (
                    <>
                        <Text style={styles.resultado}>Despesas do mês:</Text>
                        <FlatList
                            data={despesas}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.despesaItem}>
                                    <Text style={styles.despesaTexto}>
                                        {item.descricao} - {parseFloat(item.valor).toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        })}
                                    </Text>
                                </View>
                            )}
                        />
                    </>
                )}
            </ScrollView>

            <Footer navigation={navigation} currentScreen="despesas" />
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
        fontSize: 18,
        color: "#010440",
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center'
    },
    despesaItem: {
        backgroundColor: "#F2F2F2",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    despesaTexto: {
        fontSize: 16,
        color: "#333"
    }
});
