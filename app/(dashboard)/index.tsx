import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Title, Texto } from "@/components/Text";
import { Header, Body } from "@/components/Layout";
import { GraficoPizza } from "@/components/GraficoPizza";



//---------------------------------------- Tipagem para as tarefas
type Tarefa = {
  id: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";
};


//---------------------------------------- Tela principal do dashboard
// Aqui vamos buscar as tarefas do usuário e mostrar a contagem por status, além de um gráfico de pizza
export default function Index() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);// estado para armazenar as tarefas
  const [loading, setLoading] = useState(false);// estado para controlar o loading

  const token = "SEU_TOKEN_AQUI"; // depois você pode pegar do AsyncStorage ou contexto



//-------------------------------- Função para buscar as tarefas do usuário 
  async function buscarTarefas() {
    try {
      setLoading(true);

      const response = await fetch("https://mb-server.vercel.app/usuario/tarefas", { // URL da API para buscar as tarefas do usuário
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });


// Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Usuário não autenticado");
        }
        throw new Error("Erro ao buscar tarefas");
      }

      const data = await response.json();
      setTarefas(data);

    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  }

// Buscar as tarefas quando o componente for montado
  useEffect(() => {
    buscarTarefas();
  }, []);


// Contar quantas tarefas existem em cada status
  const pendentes = tarefas.filter(t => t.status === "PENDENTE").length;
  const emAndamento = tarefas.filter(t => t.status === "EM_ANDAMENTO").length;
  const concluidas = tarefas.filter(t => t.status === "CONCLUIDA").length;

  return (
    <View style={styles.container}>

      <View style={styles.headersRow}>

        <Header
          componente01={<Title texto="A fazer" />}
          componente02={<Texto texto={String(pendentes)} />}
        />

        <Header
          componente01={<Title texto="Em andamento" />}
          componente02={<Texto texto={String(emAndamento)} />}
        />

        <Header
          componente01={<Title texto="Concluído" />}
          componente02={<Texto texto={String(concluidas)} />}
        />

      </View>

      <Body
        componente01={
          <GraficoPizza
            pendentes={pendentes}
            emAndamento={emAndamento}
            concluidas={concluidas}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f2e7fe",
  },
  headersRow: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 10,
  },
});
