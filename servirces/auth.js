import api from "./api";
import { Alert } from "react-native";

const URL = api;

export async function API_AUTH(name, email, password, confirmPassword) {

    // 🔹 Validações ANTES da requisição
    if (!name || !email || !password || !confirmPassword) {
        Alert.alert("Preencha todos os campos");
      
    }

    if (password !== confirmPassword) {
        Alert.alert("As senhas não coincidem");
        
    }

    try {
        const response = await fetch(`${URL}/api/auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        // 🔹 Proteção contra resposta que não é JSON
        let data;
        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {
            throw new Error(data.error || "Erro ao cadastrar");
        }

        Alert.alert("Cadastro realizado com sucesso!");
        return data;

    } catch (error) {
        Alert.alert("Erro ao fazer cadastro", error.message || "Erro ao fazer cadastro");
        throw error;
    }
}
