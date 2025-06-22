import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StatusCards({ limite, totalGasto }) {
    const navigation = useNavigation();
    const gastoFormatado = totalGasto.toFixed(2);
    const limiteFormatado = limite.toFixed(2);
    const dentroDoLimite = totalGasto <= limite;
    const porcentagemGasta = limite > 0 ? Math.min((totalGasto / limite) * 100, 100) : 0;
    const restante = limite > 0 ? Math.max(limite - totalGasto, 0) : 0;
    const restanteFormatado = restante.toFixed(2);

    if (limite === 0 && totalGasto === 0) {
        return (
            <View style={[styles.cardContainer, styles.neutralCard]}>
                <View style={styles.iconContainer}>
                    <Text style={styles.emoji}>🚀</Text>
                </View>
                <Text style={styles.title}>Vamos começar?</Text>
                <Text style={styles.subtitle}>Organize suas finanças</Text>
                <Text style={styles.message}>
                    Defina um limite mensal e comece a registrar suas despesas para ter controle total dos seus gastos.
                </Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('limite')}>
                    <Text style={styles.buttonText}>Definir Limite</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (limite === 0 && totalGasto > 0) {
        return (
            <View style={[styles.cardContainer, styles.warningCard]}>
                <View style={styles.iconContainer}>
                    <Text style={styles.emoji}>📊</Text>
                </View>
                <Text style={styles.title}>Defina um Limite</Text>

                <View style={styles.valueContainer}>
                    <Text style={styles.valueLabel}>Total gasto</Text>
                    <Text style={styles.valueAmount}>R$ {gastoFormatado}</Text>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, styles.dangerProgress, { width: '100%' }]} />
                    </View>
                    <Text style={styles.progressText}>100%</Text>
                </View>

                <Text style={styles.message}>
                    Você já tem despesas registradas, mas ainda não definiu um limite. Isso é importante para controlar seus gastos.
                </Text>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('limite')}>
                    <Text style={styles.buttonText}>Definir Limite</Text>
                </TouchableOpacity>
            </View>
        );
    }


    if (limite > 0 && totalGasto > limite) {
        return (
            <View style={[styles.cardContainer, styles.dangerCard]}>
                <View style={styles.iconContainer}>
                    <Text style={styles.emoji}>🚨</Text>
                </View>
                <Text style={styles.title}>Limite Ultrapassado</Text>
                <View style={styles.valuesRow}>
                    <View style={styles.valueItem}>
                        <Text style={styles.valueLabel}>Gasto</Text>
                        <Text style={[styles.valueAmount, styles.dangerText]}>R$ {gastoFormatado}</Text>
                    </View>
                    <View style={styles.valueItem}>
                        <Text style={styles.valueLabel}>Limite</Text>
                        <Text style={styles.valueAmount}>R$ {limiteFormatado}</Text>
                    </View>
                </View>
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, styles.dangerProgress, { width: '100%' }]} />
                    </View>
                    <Text style={styles.progressText}>{porcentagemGasta.toFixed(0)}%</Text>
                </View>
                <Text style={styles.message}>
                    Você ultrapassou seu limite em R$ {(totalGasto - limite).toFixed(2)}. Considere revisar seus gastos.
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.cardContainer, styles.successCard]}>
            <View style={styles.iconContainer}>
                <Text style={styles.emoji}>✅</Text>
            </View>
            <Text style={styles.title}>Dentro do Limite</Text>
            <View style={styles.valuesRow}>
                <View style={styles.valueItem}>
                    <Text style={styles.valueLabel}>Gasto</Text>
                    <Text style={[styles.valueAmount, styles.successText]}>R$ {gastoFormatado}</Text>
                </View>
                <View style={styles.valueItem}>
                    <Text style={styles.valueLabel}>Disponível</Text>
                    <Text style={styles.valueAmount}>R$ {restanteFormatado}</Text>
                </View>
            </View>
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, styles.successProgress, { width: `${porcentagemGasta}%` }]} />
                </View>
                <Text style={styles.progressText}>{porcentagemGasta.toFixed(0)}%</Text>
            </View>
            <Text style={styles.message}>
                Excelente controle! Você ainda tem R$ {restanteFormatado} disponíveis este mês.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emoji: {
        fontSize: 28,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: "#1A1A1A",
        marginBottom: 4,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: "#666666",
        marginBottom: 16,
        textAlign: 'center',
        fontWeight: '500',
    },
    message: {
        fontSize: 14,
        color: "#555555",
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 12,
    },
    valueContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    valuesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    valueItem: {
        alignItems: 'center',
        flex: 1,
    },
    valueLabel: {
        fontSize: 12,
        color: "#888888",
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    valueAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: "#1A1A1A",
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#E8E8E8',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: "#666666",
    },
    successCard: {
        borderLeftWidth: 4,
        borderLeftColor: "#10B981",
        backgroundColor: '#FAFFFE',
    },
    dangerCard: {
        borderLeftWidth: 4,
        borderLeftColor: "#EF4444",
        backgroundColor: '#FFFAFA',
    },
    warningCard: {
        borderLeftWidth: 4,
        borderLeftColor: "#F59E0B",
        backgroundColor: '#FFFBF0',
    },
    neutralCard: {
        borderLeftWidth: 4,
        borderLeftColor: "#6366F1",
        backgroundColor: '#FAFAFF',
    },
    successText: {
        color: "#10B981",
    },
    dangerText: {
        color: "#EF4444",
    },
    successProgress: {
        backgroundColor: "#10B981",
    },
    dangerProgress: {
        backgroundColor: "#EF4444",
    },
    button: {
        marginTop: 16,
        backgroundColor: '#6366F1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
        textAlign: 'center',
    },
});