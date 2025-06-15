import React, { useState, useEffect } from "react";
import {
    StyleSheet, Text, View,
    TouchableOpacity
} from 'react-native';
import Toast from 'react-native-toast-message';
import { UsuarioDTO } from "../model/DTOs/UsuarioDto";
import { cadastrar } from "../service/auth/CadastroService";
import { mostrarToast } from "../components/Toast";
import Input from "../components/Input";
import InputMasked from "../components/InputMasked";

export default function Cadastro({ navigation }) {
    const [usuario, setUsuario] = useState(new UsuarioDTO('', '', '', '', ''));
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [erros, setErros] = useState({});

    useEffect(() => {
        setIsValid(usuario.isValid());
    }, [usuario]);

    const handleChange = (campo, valor) => {
        setUsuario(prev => {
            const novo = new UsuarioDTO(
                prev.nome,
                prev.email,
                prev.dataNascimento,
                prev.senha,
                prev.confirmarSenha
            );
            novo[campo] = valor;
            return novo;
        });
    };

    const handleCadastro = async () => {
        const errosValidacao = usuario.validarCampos();
        setErros(errosValidacao);

        if (Object.keys(errosValidacao).length > 0) {
            mostrarToast('error', 'Erro', 'Verifique os campos do formulário.');
            return;
        }

        setIsLoading(true);
        try {
            await cadastrar(usuario.toJSON());
            mostrarToast('success', 'Sucesso', 'Cadastro realizado com sucesso!');
            setTimeout(() => navigation.navigate("login"), 1500);
        } catch (error) {
            mostrarToast('error', 'Erro no Cadastro', error.message || "Erro ao cadastrar");
        } finally {
            setIsLoading(false);
        }
    };


    const nvgLogin = () => {
        navigation.navigate("login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.tituloInicial}>Cadastro</Text>

            <View style={styles.formContainer}>

                <Input
                    label="Nome: *"
                    value={usuario.nome}
                    onChange={(text) => handleChange("nome", text)}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#555"
                    error={erros.nome}
                />

                <Input
                    label="Email: *"
                    value={usuario.email}
                    onChange={(text) => handleChange("email", text)}
                    placeholder="Digite seu email"
                    placeholderTextColor="#555"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={erros.email}
                />

                <InputMasked
                    label="Data de Nascimento: *"
                    value={usuario.dataNascimento}
                    onChange={(text) => handleChange("dataNascimento", text)}
                    type="datetime"
                    options={{ format: "DD/MM/YYYY" }}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#555"
                    error={erros.dataNascimento}
                />

                <Input
                    label="Senha: *"
                    value={usuario.senha}
                    onChange={(text) => handleChange("senha", text)}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#555"
                    secureTextEntry
                    error={erros.senha}
                />

                <Input
                    label="Confirmar Senha: *"
                    value={usuario.confirmarSenha}
                    onChange={(text) => handleChange("confirmarSenha", text)}
                    placeholder="Confirme sua senha"
                    placeholderTextColor="#555"
                    secureTextEntry
                    error={erros.confirmarSenha}
                />

                <TouchableOpacity
                    style={[styles.buttonEntrar, !isValid && styles.buttonDisabilitado]}
                    onPress={handleCadastro}
                    disabled={!isValid || isLoading}
                >
                    <Text style={styles.textButton}>
                        {isLoading ? "..." : "Cadastrar"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.textoPossuiConta}>
                    <TouchableOpacity onPress={nvgLogin}>
                        <Text style={styles.textoRota}>Já possui uma conta?</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Toast />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2C4B3",
        alignItems: 'center',
        paddingTop: 100,
    },
    tituloInicial: {
        color: "#010440",
        fontSize: 40,
        fontWeight: 'bold',
        paddingBottom: 20,
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
        justifyContent: 'center',
        paddingHorizontal: 10,
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
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: -12,
        marginBottom: 12,
        alignSelf: "flex-start",
    },
});
