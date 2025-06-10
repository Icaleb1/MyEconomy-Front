import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

import Toast from "react-native-toast-message";
import { mostrarToast } from '../components/Toast';
import { UsuarioDTO } from "../model/DTOs/UsuarioDto";
import Input from "../components/Input";
import { cadastrar } from "../service/auth/CadastroService";

export default function Cadastro({ navigation }) {
    const [usuario, setUsuario] = useState(new UsuarioDTO('', '', '', '', ''));
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [erros, setErros] = useState({});


    useEffect(() => {
        const novoUsuario = new UsuarioDTO(
            usuario.nome,
            usuario.email,
            usuario.dataNascimento,
            usuario.senha,
            usuario.confirmarSenha
        );

        const errosValidacao = novoUsuario.validarCampos();
        setErros(errosValidacao);
        setIsValid(Object.keys(errosValidacao).length === 0);

    }, [usuario]);

    const handleChange = (campo, valor) => {
        setUsuario({ ...usuario, [campo]: valor });
    };

    const handleCadastro = async () => {
        if (!isValid) return;

        setIsLoading(true);
        try {
            const dto = new UsuarioDTO(
                usuario.nome,
                usuario.email,
                usuario.dataNascimento,
                usuario.senha,
                usuario.confirmarSenha
            );

            await cadastrar(dto.nome, dto.email, dto.dataNascimento, dto.senha, dto.confirmarSenha);
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
                <View>
                    <Input label="Nome" value={usuario.nome} onChange={value => handleChange("nome", value)} />
                    {erros.nome && <Text style={styles.errorText}>{erros.nome}</Text>}
                </View>
                <View>
                    <Input label="Email" value={usuario.email} onChange={value => handleChange("email", value)} keyboardType="email-address" />
                    {erros.email && <Text style={styles.errorText}>{erros.email}</Text>}
                </View>
                <View>
                    <Input label="Data de Nascimento" value={usuario.dataNascimento} onChange={value => handleChange("dataNascimento", value)} />
                    {erros.dataNascimento && <Text style={styles.errorText}>{erros.dataNascimento}</Text>}
                </View>
                <View>
                    <Input label="Senha" value={usuario.senha} onChange={value => handleChange("senha", value)} secureTextEntry />
                    {erros.senha && <Text style={styles.errorText}>{erros.senha}</Text>}
                </View>
                <View>
                    <Input label="Confirmar Senha" value={usuario.confirmarSenha} onChange={value => handleChange("confirmarSenha", value)} secureTextEntry />
                    {erros.confirmarSenha && <Text style={styles.errorText}>{erros.confirmarSenha}</Text>}
                </View>
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
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: -12,
        marginBottom: 12,
        alignSelf: "flex-start",
    
    },
    
});
