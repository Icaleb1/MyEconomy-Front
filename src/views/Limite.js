import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "../components/Footer";
import { buscarLimite, criarLimite, editarLimite, excluirLimite } from "../service/LimiteService";
import { LimiteDTO } from "../model/DTOs/LimiteDto";
import { mostrarToast } from "../components/Toast";
import Input from "../components/Input";
import InputSelect from "../components/InputSelect";
import LimiteModal from "../components/LimiteModal";

function DateSelect({ modo, anoSelecionado, mesSelecionado, onAnoChange, onMesChange }) {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;

  const anos = useMemo(() => Array.from({ length: 30 }, (_, i) => (anoAtual + i).toString()), [anoAtual]);
  const mesesTodos = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const mesesFiltrados = useMemo(() => {
    const anoNum = parseInt(anoSelecionado);
    return modo === "cadastro"
      ? mesesTodos.filter((mes) => anoNum > anoAtual || mes >= mesAtual)
      : mesesTodos;
  }, [modo, anoSelecionado, mesAtual, anoAtual]);

  const opcoesAno = useMemo(() => anos.map((ano) => ({ label: ano, value: ano })), [anos]);
  const opcoesMes = useMemo(
    () =>
      mesesFiltrados.map((mes) => ({
        label: new Date(0, mes - 1).toLocaleString("pt-BR", { month: "long" }),
        value: mes.toString(),
      })),
    [mesesFiltrados]
  );

  useEffect(() => {
    const mesValido = mesesFiltrados.includes(Number(mesSelecionado));
    if (modo === "cadastro" && mesSelecionado && !mesValido) {
      onMesChange("");
    }
  }, [anoSelecionado, mesesFiltrados]);

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

export default function Limite({ navigation }) {
  const [valor, setValor] = useState("");
  const [mesCadastro, setMesCadastro] = useState("");
  const [mesBusca, setMesBusca] = useState("");
  const [anoCadastro, setAnoCadastro] = useState(new Date().getFullYear().toString());
  const [anoBusca, setAnoBusca] = useState(new Date().getFullYear().toString());
  const [limiteBuscado, setLimiteBuscado] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [idLimiteAtual, setIdLimiteAtual] = useState(null);

  const mesAtual = new Date().getMonth() + 1;
  const anoAtual = new Date().getFullYear();

  const handleSalvar = async () => {
    const valorNum = Number.parseFloat(valor.replace(",", "."));
    const mesNum = Number.parseInt(mesCadastro);
    const anoNum = Number.parseInt(anoCadastro);

    if (isNaN(valorNum) || !mesCadastro || isNaN(anoNum)) {
      mostrarToast("error", "Erro", "Preencha todos os campos corretamente.");
      return;
    }

    const mesReferencia = `${String(mesNum).padStart(2, "0")}-01-${anoNum}`;
    const limite = new LimiteDTO(mesReferencia, valorNum);

    try {
      await criarLimite(limite.toJSON());
      mostrarToast("success", "Limite criado!", "Seu limite foi salvo com sucesso.");
      setValor("");
    } catch (error) {
      mostrarToast("error", "Erro ao criar limite", error.message || "Tente novamente mais tarde.");
    }
  };

  const handleBuscarLimite = async () => {
    const mesNum = Number.parseInt(mesBusca);
    const anoNum = Number.parseInt(anoBusca);

    if (!mesBusca || isNaN(mesNum) || isNaN(anoNum)) {
      mostrarToast("error", "Erro", "Selecione mês e ano válidos.");
      return;
    }

    try {
      const limite = await buscarLimite(mesNum, anoNum);
      if (limite) {
        setLimiteBuscado(limite.valor);
        setIdLimiteAtual(limite.id);
        mostrarToast("success", "Limite encontrado", `R$ ${limite.valor}`);
      } else {
        setLimiteBuscado(null);
        setIdLimiteAtual(null);
        mostrarToast("info", "Sem limite", "Nenhum limite cadastrado para esse mês.");
      }
    } catch (error) {
      mostrarToast("error", "Erro", error.message || "Falha ao buscar limite.");
    }
  };

  const handleEditar = () => {
    const anoNum = Number(anoBusca);
    const mesNum = Number(mesBusca);

    if (
      limiteBuscado &&
      (anoNum > anoAtual || (anoNum === anoAtual && mesNum >= mesAtual))
    ) {
      setModalVisivel(true);
    } else {
      mostrarToast("error", "Edição não permitida", "Só é possível editar limites do mês atual ou posterior.");
    }
  };

  const salvarEdicao = async (novoValor) => {
    try {
      const id = idLimiteAtual;
      if (!id) return;
      await editarLimite(id, novoValor);
      mostrarToast("success", "Limite atualizado", "Novo valor salvo.");
      setModalVisivel(false);
      setLimiteBuscado(novoValor);
    } catch (error) {
      mostrarToast("error", "Erro ao editar", error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#F2C4B3", "#FFA07A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Gerenciar Limites 💸</Text>

        <Input
          label="Valor (R$):"
          value={valor}
          onChangeText={setValor}
          placeholder="Ex: 1500.00"
          keyboardType="numeric"
        />

        <DateSelect
          modo="cadastro"
          anoSelecionado={anoCadastro}
          mesSelecionado={mesCadastro}
          onAnoChange={setAnoCadastro}
          onMesChange={setMesCadastro}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <Text style={styles.saveButtonText}>Salvar Limite</Text>
        </TouchableOpacity>

        <DateSelect
          modo="busca"
          anoSelecionado={anoBusca}
          mesSelecionado={mesBusca}
          onAnoChange={setAnoBusca}
          onMesChange={setMesBusca}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleBuscarLimite}>
          <Text style={styles.saveButtonText}>Buscar Limite</Text>
        </TouchableOpacity>

        {limiteBuscado !== null && (
          <View>
            <Text style={styles.resultado}>Limite para o mês selecionado:</Text>

            <View style={styles.resultadoContainer}>
              <Text style={styles.resultadoTexto}>
                {limiteBuscado.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>

              <View style={styles.botoesAcoes}>
                <TouchableOpacity style={styles.editarBotao} onPress={handleEditar}>
                  <Text style={styles.botaoTexto}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.excluirBotao}
                  onPress={() => {
                    Alert.alert("Confirmar exclusão", "Tem certeza que deseja excluir este limite?", [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Excluir",
                        style: "destructive",
                        onPress: async () => {
                          try {
                            await excluirLimite(idLimiteAtual);
                            setLimiteBuscado(null);
                            mostrarToast("success", "Limite excluído", "Limite foi removido.");
                          } catch (error) {
                            mostrarToast("error", "Erro ao excluir", error.message);
                          }
                        },
                      },
                    ]);
                  }}
                >
                  <Text style={styles.botaoTexto}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <Footer navigation={navigation} currentScreen="limite" />
      <LimiteModal
        visible={modalVisivel}
        onClose={() => setModalVisivel(false)}
        onSalvar={salvarEdicao}
        valorAtual={limiteBuscado}
      />
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
    textAlign: "center",
    fontWeight: "bold",
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
