import api from "./api";

const url = api.defaults.baseURL;

export async function API_LOGIN(email, password) {

    if (email === "" || password === "") {
        alert("Preencha todos os campos");
    }

    try {
        const response = await fetch(`${url}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        let data;
        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (!response.ok) {
            throw new Error(data.error || "Credenciais inválidas");
        }

        alert("Login realizado com sucesso!");
        return data;

    } catch (error) {
        alert(error.message || "Erro ao fazer login");
        throw error;
    }

}

