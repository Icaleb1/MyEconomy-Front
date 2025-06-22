"use client"

import { useState, useEffect } from "react"
import { StyleSheet, Text, View, ScrollView } from "react-native"
import Footer from "../components/Footer"
import { LinearGradient } from "expo-linear-gradient"
import { buscarLimite } from "../service/LimiteService"
import { buscarDespesas } from "../service/DespesaService"
import { mostrarToast } from "../components/Toast"
import StatusCards from "../components/StatusCards"
import DateSelect from "../components/DateSelect"

export default function Home({ navigation }) {
    const anoAtual = new Date().getFullYear()
    const mesAtual = new Date().getMonth() + 1

    const [anoSelecionado, setAnoSelecionado] = useState(anoAtual.toString())
    const [mesSelecionado, setMesSelecionado] = useState(mesAtual.toString())
    const [monthlyLimit, setMonthlyLimit] = useState(0)
    const [monthlyExpenses, setMonthlyExpenses] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const carregarDadosDoMes = async () => {
        if (!anoSelecionado || !mesSelecionado) return
    
        setIsLoading(true)
    
        const ano = Number.parseInt(anoSelecionado)
        const mes = Number.parseInt(mesSelecionado)
    
        try {
            const limite = await buscarLimite(mes, ano)
            setMonthlyLimit(limite?.valor || 0)
        } catch (error) {
            setMonthlyLimit(0)
        }

        try {
            const despesas = await buscarDespesas(mes, ano)
    
            const totalDespesas = despesas.reduce(
                (total, despesa) => total + Number.parseFloat(despesa.valor),
                0
            )
            setMonthlyExpenses(totalDespesas)
        } catch (error) {
            mostrarToast("error", "Erro", "Não foi possível carregar as despesas do período.")
            setMonthlyExpenses(0)
        }
    
        setIsLoading(false)
    }
    

    useEffect(() => {
        carregarDadosDoMes()
    }, [anoSelecionado, mesSelecionado])

    const handleAnoChange = (novoAno) => {
        setAnoSelecionado(novoAno)
    }

    const handleMesChange = (novoMes) => {
        setMesSelecionado(novoMes)
    }

    const getPeriodoTexto = () => {
        if (!mesSelecionado || !anoSelecionado) return "Período não selecionado"

        const mesNome = new Date(0, Number.parseInt(mesSelecionado) - 1).toLocaleString("pt-BR", { month: "long" })
        const mesCapitalizado = mesNome.charAt(0).toUpperCase() + mesNome.slice(1)
        return `${mesCapitalizado} de ${anoSelecionado}`
    }

    const isCurrentPeriod = () => {
        return Number.parseInt(anoSelecionado) === anoAtual && Number.parseInt(mesSelecionado) === mesAtual
    }

    return (
        <LinearGradient
            colors={["#F2C4B3", "#FFA07A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <Text style={styles.welcomeTitle}>{isCurrentPeriod() ? "Bem-vindo! 👋" : "Consulta Histórica 📊"}</Text>
                    <Text style={styles.welcomeDescription}>
                        {isCurrentPeriod()
                            ? "Gerencie suas despesas de forma inteligente e mantenha suas finanças em dia."
                            : "Visualize seus dados financeiros de períodos anteriores ou futuros."}
                    </Text>
                </View>

                <View style={styles.dateSelectContainer}>
                    <Text style={styles.sectionTitle}>Selecione o período:</Text>
                    <View style={styles.dateSelectWrapper}>
                        <DateSelect
                            modo="busca"
                            anoSelecionado={anoSelecionado}
                            mesSelecionado={mesSelecionado}
                            onAnoChange={handleAnoChange}
                            onMesChange={handleMesChange}
                        />
                    </View>
                </View>

                <View style={styles.periodInfoContainer}>
                    <Text style={styles.periodText}>📅 {getPeriodoTexto()}</Text>
                    {isLoading && <Text style={styles.loadingText}>Carregando dados...</Text>}
                </View>

                <StatusCards limite={monthlyLimit} totalGasto={monthlyExpenses} />

                {(monthlyLimit > 0 || monthlyExpenses > 0) && (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.sectionTitle}>Resumo Financeiro</Text>
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Limite Definido</Text>
                                    <Text style={[styles.summaryValue, styles.limitValue]}>R$ {monthlyLimit.toFixed(2)}</Text>
                                </View>
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Total Gasto</Text>
                                    <Text
                                        style={[
                                            styles.summaryValue,
                                            monthlyExpenses > monthlyLimit ? styles.expenseOverValue : styles.expenseValue,
                                        ]}
                                    >
                                        R$ {monthlyExpenses.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

                <View style={styles.spacer} />
            </ScrollView>

            <Footer navigation={navigation} currentScreen="home" />
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingTop: 60,
    },
    headerContainer: {
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#010440",
        marginBottom: 10,
        textAlign: "center",
    },
    welcomeDescription: {
        fontSize: 16,
        color: "#010440",
        textAlign: "center",
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    dateSelectContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#010440",
        marginBottom: 15,
    },
    dateSelectWrapper: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    periodInfoContainer: {
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    periodText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#010440",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        overflow: "hidden",
    },
    loadingText: {
        fontSize: 14,
        color: "#666666",
        fontStyle: "italic",
        marginTop: 8,
    },
    summaryContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    summaryCard: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    summaryItem: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 8,
    },
    summaryLabel: {
        fontSize: 12,
        color: "#666666",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 4,
        textAlign: "center",
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },
    limitValue: {
        color: "#6366F1",
    },
    expenseValue: {
        color: "#10B981",
    },
    expenseOverValue: {
        color: "#EF4444",
    },
    availableValue: {
        color: "#10B981",
    },
    exceedValue: {
        color: "#EF4444",
    },
    spacer: {
        height: 100,
    },
})
