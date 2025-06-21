import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Footer from '../components/Footer';
import { sair } from "../service/auth/LoginService";
import { buscarPerfil } from "../service/PerfilService";
import { LinearGradient } from 'expo-linear-gradient';

export default function Perfil({ navigation }) {
    const [profileData, setProfileData] = useState({
        nome: '',
        email: '',
        dataNascimento: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await buscarPerfil();
                setProfileData(profile);
            } catch (error) {
                console.error("Erro ao buscar perfil:", error.message);
            }
        };
        fetchProfile();
    }, []);


    const handleChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handleLogout = async () => {
        try {
            await sair();
            navigation.navigate("login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    return (
        <LinearGradient
            colors={['#F2C4B3', '#FFA07A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Meu Perfil 👤</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome:</Text>
                    <Text style={styles.value}>{profileData.nome}</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{profileData.email}</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Data de Nascimento:</Text>
                    <Text style={styles.value}>{profileData.dataNascimento}</Text>
                </View>


                <TouchableOpacity style={styles.saveButton} onPress={handleLogout}>
                    <Text style={styles.saveButtonText}>Sair</Text>
                </TouchableOpacity>
            </ScrollView>

            <Footer navigation={navigation} currentScreen="perfil" />
        </LinearGradient>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: "#010440",
        marginBottom: 30,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#010440",
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        backgroundColor: "#f2DCF1",
        borderWidth: 2,
        borderColor: "#1B0273",
        borderRadius: 5,
        paddingHorizontal: 15,
        color: "#010440",
        fontSize: 16,
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
    value: {
        fontSize: 16,
        color: "#010440",
        backgroundColor: "#f2DCF1",
        padding: 15,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "#1B0273",
      }
      
});
