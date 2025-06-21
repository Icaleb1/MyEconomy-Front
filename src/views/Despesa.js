import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    Alert
} from 'react-native';
import Footer from '../components/Footer';
import { criarDespesa, buscarDespesas, excluirDespesa } from "../service/DespesaService";
import { DespesaDTO } from "../model/DTOs/DespesaDto";
import { mostrarToast } from "../components/Toast";
import Input from '../components/Input';
import InputSelect from '../components/InputSelect';
import { LinearGradient } from 'expo-linear-gradient';
import DespesaModal from '../components/DespesaModal'; // ajuste o caminho conforme seu projeto

export default function Despesa({ navigation }) {
    const [valor, setValor] = useState('');
    const [descricao, setDescricao] = useState('');
    const [mesCadastro, setMesCadastro] = useState('');
    const [mesBusca, setMesBusca] = useState('');
    const [despesas, setDespesas] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [despesaSelecionada, setDespesaSelecionada] = useState(null);

    const anoAtual = new Date().getFullYear();
    const mesAtual = new Date().getMonth() + 1;

    const mesesParaCadastro = Array.from({ length: 12 }, (_, i) => i + 1).filter(m => m >= mesAtual);
    const mesesParaBusca = Array.from({ length: 12 }, (_, i) => i + 1);

    const formatMeses = (meses) =>
        meses.map(mes => ({
            label: new Date(anoAtual, mes - 1).toLocaleString('pt-BR', { month: 'long' }),
            value: mes.toString()
        }));

    function abrirModalEdicao(despesa) {
        setDespesaSelecionada(despesa);
        setModalVisible(true);
    }

    function onDespesaAtualizada(despesaAtualizada) {
        setDespesas(prev =>
            prev.map(d => (d.id === despesaAtualizada.id ? despesaAtualizada : d))
        );
    }

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

    const handleExcluir = (idDespesa) => {
        Alert.alert(
          "Confirmar Exclusão",
          "Tem certeza que deseja excluir esta despesa?",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Excluir",
              style: "destructive",
              onPress: async () => {
                try {
                  await excluirDespesa(idDespesa);
                  setDespesas(prev => prev.filter(d => d.id !== idDespesa));
                  mostrarToast("success", "Despesa excluída", "A despesa foi removida com sucesso.");
                } catch (error) {
                  mostrarToast("error", "Erro ao excluir", error.message || "Tente novamente mais tarde.");
                }
              }
            }
          ]
        );
      };
      


    return (
        <LinearGradient
            colors={['#F2C4B3', '#FFA07A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <FlatList
                contentContainerStyle={styles.scrollContainer}
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

                        <View style={styles.botoesAcoes}>
                            <TouchableOpacity onPress={() => abrirModalEdicao(item)} style={styles.editarBotao}>
                                <Text style={styles.editarTexto}>Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleExcluir(item.id)} style={styles.excluirBotao}>
                                <Text style={styles.excluirTexto}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                ListHeaderComponent={
                    <>
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
                            <Text style={styles.resultado}>Despesas do mês:</Text>
                        )}
                    </>
                }
            />
            <DespesaModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                despesa={despesaSelecionada}
                onDespesaAtualizada={onDespesaAtualizada}
            />

            <Footer navigation={navigation} currentScreen="despesa" />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center' },
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
    },
    editarBotao: {
        marginTop: 8,
        alignSelf: 'flex-start',
        backgroundColor: '#5288F2',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
    },
    editarTexto: {
        color: 'white',
        fontWeight: 'bold'
    },
    botoesAcoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 10
    },
    excluirBotao: {
        backgroundColor: '#D9534F',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 4,
    },
    excluirTexto: {
        color: 'white',
        fontWeight: 'bold'
    }

});
