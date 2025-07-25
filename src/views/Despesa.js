import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from "react-native";
import Footer from "../components/Footer";
import { criarDespesa, buscarDespesas, excluirDespesa } from "../service/DespesaService";
import { DespesaDTO } from "../model/DTOs/DespesaDto";
import { mostrarToast } from "../components/Toast";
import Input from "../components/Input";
import InputSelect from "../components/InputSelect";
import { LinearGradient } from "expo-linear-gradient";
import DespesaModal from "../components/DespesaModal";

function DateSelect({ modo, anoSelecionado, mesSelecionado, onAnoChange, onMesChange }) {
  const agora = new Date();
  const anoAtual = agora.getFullYear();
  const mesAtual = agora.getMonth() + 1;

  const anos = useMemo(() => Array.from({ length: 30 }, (_, i) => (anoAtual + i).toString()), [anoAtual]);
  const mesesTodos = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const mesesFiltrados = useMemo(() => {
    const anoNum = parseInt(anoSelecionado);
    
    if (isNaN(anoNum)) return [];
    
    if (modo === "cadastro") {
      if (anoNum > anoAtual) {
        return mesesTodos;
      } else if (anoNum === anoAtual) {
        const mesesValidos = mesesTodos.filter((mes) => mes >= mesAtual);
        return mesesValidos;
      } else {
        return [];
      }
    }
    
    return mesesTodos;
  }, [modo, anoSelecionado, mesAtual, anoAtual, mesesTodos]);

  const opcoesAno = useMemo(() => anos.map((ano) => ({ label: ano, value: ano })), [anos]);
  
  const opcoesMes = useMemo(
    () =>
      mesesFiltrados.map((mes) => ({
        label: new Date(2024, mes - 1).toLocaleString("pt-BR", { month: "long" }),
        value: mes.toString(),
      })),
    [mesesFiltrados]
  );

  useEffect(() => {
    if (modo === "cadastro" && mesesFiltrados.length > 0) {
      const mesValido = mesesFiltrados.includes(Number(mesSelecionado));
      
      if (!mesSelecionado || !mesValido) {
        onMesChange(mesesFiltrados[0].toString());
      }
    }
  }, [anoSelecionado, mesesFiltrados, mesSelecionado, modo, onMesChange]);

  return (
    <View>
      <InputSelect
        label={`Ano para ${modo === "cadastro" ? "Cadastro" : "Busca"}:`}
        selectedValue={anoSelecionado}
        onValueChange={onAnoChange}
        options={opcoesAno}
      />
      <InputSelect
        label={`Mês para ${modo === "cadastro" ? "Cadastro" : "Busca"}:`}
        selectedValue={mesSelecionado}
        onValueChange={onMesChange}
        options={opcoesMes}
      />
    </View>
  );
}

export default function Despesa({ navigation }) {
  const [valor, setValor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mesCadastro, setMesCadastro] = useState("");
  const [anoCadastro, setAnoCadastro] = useState(new Date().getFullYear().toString());
  const [mesBusca, setMesBusca] = useState("");
  const [anoBusca, setAnoBusca] = useState(new Date().getFullYear().toString());
  const [despesas, setDespesas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [despesaSelecionada, setDespesaSelecionada] = useState(null);

  function abrirModalEdicao(despesa) {
    setDespesaSelecionada(despesa);
    setModalVisible(true);
  }

  function onDespesaAtualizada(despesaAtualizada) {
    setDespesas((prev) => prev.map((d) => (d.id === despesaAtualizada.id ? despesaAtualizada : d)));
  }

  const handleSalvar = async () => {
    const valorNum = Number.parseFloat(valor.replace(",", "."));
    const mesNum = Number.parseInt(mesCadastro);
    const anoNum = Number.parseInt(anoCadastro);

    if (!descricao || isNaN(valorNum) || !mesCadastro || isNaN(anoNum)) {
      mostrarToast("error", "Erro", "Preencha todos os campos corretamente.");
      return;
    }

    const mesReferencia = `${String(mesNum).padStart(2, "0")}-01-${anoNum}`;
    const novaDespesa = new DespesaDTO(mesReferencia, valorNum, descricao);

    try {
      await criarDespesa(novaDespesa.toJSON());
      mostrarToast("success", "Despesa criada!", "Sua despesa foi salva com sucesso.");
      setValor("");
      setDescricao("");
    } catch (error) {
      mostrarToast("error", "Erro ao criar despesa", error.message || "Tente novamente mais tarde.");
    }
  };

  const handleBuscarDespesas = async () => {
    const mesNum = Number.parseInt(mesBusca);
    const anoNum = Number.parseInt(anoBusca);

    if (!mesBusca || isNaN(mesNum) || isNaN(anoNum)) {
      mostrarToast("error", "Erro", "Selecione mês e ano válidos.");
      return;
    }

    try {
      const resultado = await buscarDespesas(mesNum, anoNum);
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
    Alert.alert("Confirmar Exclusão", "Tem certeza que deseja excluir esta despesa?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await excluirDespesa(idDespesa);
            setDespesas((prev) => prev.filter((d) => d.id !== idDespesa));
            mostrarToast("success", "Despesa excluída", "A despesa foi removida com sucesso.");
          } catch (error) {
            mostrarToast("error", "Erro ao excluir", error.message || "Tente novamente mais tarde.");
          }
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={["#F2C4B3", "#FFA07A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <FlatList
        contentContainerStyle={styles.scrollContainer}
        data={despesas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultadoContainer}>
            <Text style={styles.resultadoTexto}>
              {item.descricao} - {Number.parseFloat(item.valor).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>

            <View style={styles.botoesAcoes}>
              <TouchableOpacity onPress={() => abrirModalEdicao(item)} style={styles.editarBotao}>
                <Text style={styles.botaoTexto}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleExcluir(item.id)} style={styles.excluirBotao}>
                <Text style={styles.botaoTexto}>Excluir</Text>
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

            <Input label="Descrição:" value={descricao} onChangeText={setDescricao} placeholder="Ex: Supermercado" />

            <DateSelect
              modo="cadastro"
              anoSelecionado={anoCadastro}
              mesSelecionado={mesCadastro}
              onAnoChange={setAnoCadastro}
              onMesChange={setMesCadastro}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
              <Text style={styles.saveButtonText}>Salvar Despesa</Text>
            </TouchableOpacity>

            <DateSelect
              modo="busca"
              anoSelecionado={anoBusca}
              mesSelecionado={mesBusca}
              onAnoChange={setAnoBusca}
              onMesChange={setMesBusca}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleBuscarDespesas}>
              <Text style={styles.saveButtonText}>Buscar Despesas</Text>
            </TouchableOpacity>

            {despesas.length > 0 && <Text style={styles.resultado}>Despesas do mês:</Text>}
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
  container: {
    flex: 1,
    alignItems: "center",
  },
  scrollContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#010440",
    marginBottom: 30,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#5288F2",
    borderRadius: 5,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1B0273",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#F2F2F2",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultado: {
    fontSize: 18,
    color: "#010440",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  resultadoContainer: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultadoTexto: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  botoesAcoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  editarBotao: {
    backgroundColor: "#5288F2",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1B0273",
  },
  excluirBotao: {
    backgroundColor: "#E74C3C",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C0392B",
  },
  botaoTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});