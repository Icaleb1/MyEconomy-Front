import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ProgressBar } from 'react-native-paper';
import Footer from '../components/Footer';
import { LinearGradient } from 'expo-linear-gradient';
import { buscarLimite } from "../service/LimiteService";
import { buscarDespesas } from "../service/DespesaService";
import { mostrarToast } from "../components/Toast";

export default function Home({ navigation }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [modalVisible, setModalVisible] = useState(false);
    const [monthlyLimit, setMonthlyLimit] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);
    
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const progressPercentage = monthlyLimit > 0 ? (monthlyExpenses / monthlyLimit) : 0;
    const isWithinLimit = monthlyExpenses <= monthlyLimit;

    const getFeedbackData = () => {
        if (isWithinLimit) {
            return {
                emoji: "🎉",
                message: "Parabéns! Você está dentro do seu limite mensal. Continue assim!",
                color: "#4CAF50"
            };
        } else {
            return {
                emoji: "⚠️",
                message: "Atenção! Você ultrapassou seu limite mensal. Revise seus gastos.",
                color: "#F44336"
            };
        }
    };

    const feedbackData = getFeedbackData();

    const carregarDadosDoMes = async () => {
        try {
            const anoAtual = new Date().getFullYear();
            const mesSelecionado = selectedMonth + 1; // Convertendo de 0-11 para 1-12

            // Buscar limite do mês
            const limite = await buscarLimite(mesSelecionado, anoAtual);
            setMonthlyLimit(limite?.valor || 0);

            // Buscar despesas do mês
            const despesas = await buscarDespesas(mesSelecionado, anoAtual);
            const totalDespesas = despesas.reduce((total, despesa) => total + parseFloat(despesa.valor), 0);
            setMonthlyExpenses(totalDespesas);

        } catch (error) {
            mostrarToast("error", "Erro", error.message || "Falha ao carregar dados do mês.");
        }
    };

    useEffect(() => {
        carregarDadosDoMes();
    }, [selectedMonth]);

    return (
        <LinearGradient
            colors={['#F2C4B3', '#FFA07A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <Text style={styles.welcomeTitle}>Bem-vindo! 👋</Text>
                    <Text style={styles.welcomeDescription}>
                        Gerencie suas despesas de forma inteligente e mantenha suas finanças em dia.
                    </Text>
                </View>

                <View style={styles.monthSelectorContainer}>
                    <Text style={styles.sectionTitle}>Selecione o mês:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedMonth}
                            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="#010440"
                        >
                            {months.map((month, index) => (
                                <Picker.Item key={index} label={month} value={index} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.feedbackButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.feedbackButtonText}>Ver Progresso do Mês</Text>
                </TouchableOpacity>

                <View style={styles.progressContainer}>
                    <Text style={styles.sectionTitle}>Progresso dos Gastos</Text>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>
                            R$ {monthlyExpenses.toFixed(2)} / R$ {monthlyLimit.toFixed(2)}
                        </Text>
                        <Text style={styles.progressPercentage}>
                            {(progressPercentage * 100).toFixed(1)}%
                        </Text>
                    </View>
                    <ProgressBar 
                        progress={Math.min(progressPercentage, 1)}
                        color={isWithinLimit ? "#4CAF50" : "#F44336"}
                        style={styles.progressBar}
                    />
                    <Text style={styles.remainingText}>
                        {isWithinLimit 
                            ? `Restam R$ ${(monthlyLimit - monthlyExpenses).toFixed(2)}`
                            : `Excedeu em R$ ${(monthlyExpenses - monthlyLimit).toFixed(2)}`
                        }
                    </Text>
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalEmoji}>{feedbackData.emoji}</Text>
                        <Text style={styles.modalTitle}>Status do Mês</Text>
                        <Text style={styles.modalMessage}>{feedbackData.message}</Text>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: feedbackData.color }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Entendi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Footer navigation={navigation} currentScreen="home" />
        </LinearGradient>
    );
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
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: "#010440",
        marginBottom: 10,
        textAlign: 'center',
    },
    welcomeDescription: {
        fontSize: 16,
        color: "#010440",
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    monthSelectorContainer: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#010440",
        marginBottom: 10,
    },
    pickerContainer: {
        backgroundColor: "#f2DCF1",
        borderWidth: 2,
        borderColor: "#1B0273",
        borderRadius: 5,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        color: "#010440",
    },
    feedbackButton: {
        backgroundColor: "#5288F2",
        borderWidth: 2,
        borderColor: "#1B0273",
        borderRadius: 5,
        paddingVertical: 15,
        marginHorizontal: 20,
        marginBottom: 25,
        alignItems: 'center',
    },
    feedbackButtonText: {
        color: "#F2F2F2",
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressContainer: {
        paddingHorizontal: 20,
        marginBottom: 100, // Espaço para o footer
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    progressText: {
        fontSize: 16,
        color: "#010440",
        fontWeight: '600',
    },
    progressPercentage: {
        fontSize: 16,
        color: "#010440",
        fontWeight: 'bold',
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        backgroundColor: "#f2DCF1",
        marginBottom: 10,
    },
    remainingText: {
        fontSize: 14,
        color: "#010440",
        textAlign: 'center',
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalEmoji: {
        fontSize: 60,
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#010440",
        marginBottom: 15,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: "#010440",
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        minWidth: 120,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});