import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { LoginDTO } from "../model/DTOs/LoginDto";
import { login } from "../service/auth/LoginService";
import { mostrarToast } from "../components/Toast";
import Input from "../components/Input";

export default function Login({ navigation }) {
    const [loginDto, setLoginDto] = useState(new LoginDTO());
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsValid(loginDto.isValid());
    }, [loginDto]);

    const handleChange = (campo, valor) => {
        setLoginDto(prev => {
            const novo = new LoginDTO(prev.email, prev.senha);
            novo[campo] = valor;
            return novo;
        });
    };

    const handleLogin = async () => {
        if (!isValid) return;

        setIsLoading(true);
        try {
            await login(loginDto.toJSON());
            mostrarToast('success', 'Sucesso', 'Login realizado com sucesso!');
            setTimeout(() => navigation.navigate("home"), 1500);
        } catch (error) {
            mostrarToast('error', 'Erro no Login', error.message || "Ocorreu um erro ao fazer login");
        } finally {
            setIsLoading(false);
        }
    };

    const nvgCadastro = () => {
        navigation.navigate("cadastro");
    };

    return (
        <LinearGradient
            colors={['#F2C4B3', '#FFA07A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <Text style={styles.tituloInicial}>Login</Text>

            <View style={styles.formContainer}>
                <Input
                    label="Email: *"
                    value={loginDto.email}
                    onChange={(text) => handleChange("email", text)}
                    placeholder="Digite seu email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Input
                    label="Senha: *"
                    value={loginDto.senha}
                    onChange={(text) => handleChange("senha", text)}
                    placeholder="Digite sua senha"
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.buttonEntrar, !isValid && styles.buttonDisabilitado]}
                    onPress={handleLogin}
                    disabled={!isValid || isLoading}
                >
                    <Text style={styles.textButton}>
                        {isLoading ? "..." : "Entrar"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.textoPossuiConta}>
                    <TouchableOpacity onPress={nvgCadastro}>
                        <Text style={styles.textoRota}>Não possui uma conta?</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Toast />
        </LinearGradient>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 100,
    },
    tituloInicial: {
        color: "white",
        fontSize: 40,
        fontWeight: 'bold',
        paddingBottom: 20,
        color: "#010440",
    },
    formContainer: {
        width: '100%',
        alignItems: 'center',
    },
    inputGroup: {
        width: 350,
        marginBottom: 16,
    },
    label: {
        fontWeight: 'bold',
        color: "#010440",
        fontSize: 18,
        marginBottom: 4,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: "#f2DCF1",
        borderWidth: 2,
        borderColor: "#1B0273",
        borderRadius: 5,
        paddingHorizontal: 10,
        color: "black",
        fontSize: 16,
    },
    buttonEntrar: {
        width: 150,
        height: 50,
        backgroundColor: "#5288F2",
        borderWidth: 2,
        borderColor: "#1B0273",
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabilitado: {
        backgroundColor: "#d3d3d3",
        borderColor: "#a0a0a0",
    },
    textButton: {
        fontWeight: 'bold',
        color: "#F2F2F2",
        fontSize: 25,
    },
    textoPossuiConta: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
    },
    textoRota: {
        fontWeight: 'bold',
        color: "white",
        fontSize: 15,
    },
    textoCadastro: {
        fontWeight: 'bold',
        color: "#ADD8E6",
        fontSize: 15,
        marginLeft: 5,
    },
});
