import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function Footer({ navigation, currentScreen }) {
    const menuItems = [
        { key: 'perfil', label: 'Perfil', screen: 'perfil' },
        { key: 'home', label: 'Home', screen: 'home' },
        { key: 'despesas', label: 'Despesas', screen: 'despesas' },
        { key: 'limite', label: 'Limites', screen: 'limite' },
    ];

    const handleNavigation = (screen) => {
        if (currentScreen !== screen.toLowerCase()) {
            navigation.navigate(screen);
        }
    };

    return (
        <View style={styles.footerContainer}>
            {menuItems.map((item) => (
                <TouchableOpacity
                    key={item.key}
                    style={[
                        styles.footerButton,
                        currentScreen === item.key && styles.activeButton
                    ]}
                    onPress={() => handleNavigation(item.screen)}
                >
                    <Text style={[
                        styles.footerButtonText,
                        currentScreen === item.key && styles.activeButtonText
                    ]}>
                        {item.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#010440',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderTopWidth: 2,
        borderTopColor: '#1B0273',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    footerButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 5,
        borderRadius: 5,
        marginHorizontal: 2,
    },
    activeButton: {
        backgroundColor: '#5288F2',
    },
    footerButtonText: {
        color: '#F2F2F2',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    activeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});