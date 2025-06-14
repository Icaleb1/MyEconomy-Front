import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { LoginDTO } from "../model/DTOs/LoginDto";
import { login } from "../service/auth/LoginService";
import { mostrarToast } from "../components/Toast";

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
        <View style={styles.container}>
            <Text style={styles.tituloInicial}>Login</Text>

            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email: *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu email"
                        keyboardType="email-address"
                        placeholderTextColor="#555"
                        value={loginDto.email}
                        onChangeText={(text) => handleChange("email", text)}
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Senha: *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua senha"
                        secureTextEntry={true}
                        placeholderTextColor="#555"
                        value={loginDto.senha}
                        onChangeText={(text) => handleChange("senha", text)}
                    />
                </View>

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
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2C4B3",
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
