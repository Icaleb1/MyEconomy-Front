"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import Footer from "../components/Footer"
import { buscarLimite, criarLimite, editarLimite, excluirLimite } from "../service/LimiteService"
import { LimiteDTO } from "../model/DTOs/LimiteDto"
import { mostrarToast } from "../components/Toast"
import Input from "../components/Input"
import InputSelect from "../components/InputSelect"
import LimiteModal from "../components/LimiteModal"

export default function Limite({ navigation }) {
  const [valor, setValor] = useState("")
  const [mesCadastro, setMesCadastro] = useState("")
  const [mesBusca, setMesBusca] = useState("")
  const [limiteBuscado, setLimiteBuscado] = useState(null)
  const [modalVisivel, setModalVisivel] = useState(false)
  const [idLimiteAtual, setIdLimiteAtual] = useState(null)

  const mesAtual = new Date().getMonth() + 1
  const anoAtual = new Date().getFullYear()

  const mesesParaCadastro = Array.from({ length: 12 }, (_, i) => i + 1).filter((mes) => mes >= mesAtual)
  const mesesParaBusca = Array.from({ length: 12 }, (_, i) => i + 1)

  const formatMeses = (meses) =>
    meses.map((mes) => ({
      label: new Date(anoAtual, mes - 1).toLocaleString("pt-BR", { month: "long" }),
      value: mes.toString(),
    }))

  const handleSalvar = async () => {
    const valorNum = Number.parseFloat(valor.replace(",", "."))
    const mesNum = Number.parseInt(mesCadastro)

    if (isNaN(valorNum) || !mesCadastro) {
      mostrarToast("error", "Erro", "Preencha todos os campos corretamente.")
      return
    }

    const mesReferencia = `${String(mesNum).padStart(2, "0")}-01-${anoAtual}`
    const limite = new LimiteDTO(mesReferencia, valorNum)

    try {
      await criarLimite(limite.toJSON())
      mostrarToast("success", "Limite criado!", "Seu limite foi salvo com sucesso.")
      setValor("")
    } catch (error) {
      mostrarToast("error", "Erro ao criar limite", error.message || "Tente novamente mais tarde.")
    }
  }

  const handleBuscarLimite = async () => {
    const mesNum = Number.parseInt(mesBusca)

    if (!mesBusca || isNaN(mesNum)) {
      mostrarToast("error", "Erro", "Selecione um mês válido.")
      return
    }

    try {
      const limite = await buscarLimite(mesNum, anoAtual)
      if (limite) {
        setLimiteBuscado(limite.valor)
        setIdLimiteAtual(limite.id)
        mostrarToast("success", "Limite encontrado", `R$ ${limite.valor}`)
      } else {
        setLimiteBuscado(null)
        setIdLimiteAtual(null)
        mostrarToast("info", "Sem limite", "Nenhum limite cadastrado para esse mês.")
      }
    } catch (error) {
      mostrarToast("error", "Erro", error.message || "Falha ao buscar limite.")
    }
  }

  const handleEditar = () => {
    if (limiteBuscado && mesBusca >= mesAtual) {
      setModalVisivel(true)
    } else {
      mostrarToast("error", "Edição não permitida", "Só é possível editar limites do mês atual ou posterior.")
    }
  }

  const salvarEdicao = async (novoValor) => {
    try {
      const id = idLimiteAtual
      if (!id) return
      await editarLimite(id, novoValor)
      mostrarToast("success", "Limite atualizado", "Novo valor salvo.")
      setModalVisivel(false)
      setLimiteBuscado(novoValor)
    } catch (error) {
      mostrarToast("error", "Erro ao editar", error.message)
    }
  }

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

        <InputSelect
          label="Mês para Cadastro:"
          selectedValue={mesCadastro}
          onValueChange={setMesCadastro}
          options={formatMeses(mesesParaCadastro)}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <Text style={styles.saveButtonText}>Salvar Limite</Text>
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
                            await excluirLimite(idLimiteAtual)
                            setLimiteBuscado(null)
                            mostrarToast("success", "Limite excluído", "Limite foi removido.")
                          } catch (error) {
                            mostrarToast("error", "Erro ao excluir", error.message)
                          }
                        },
                      },
                    ])
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
  )
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
})
