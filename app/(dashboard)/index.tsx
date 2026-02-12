import { GraficoPizza } from "@/components/GraficoPizza";
import { Body, Header } from "@/components/Layout";
import { Texto, Title } from "@/components/Text";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

// Importações do seu sistema de API e Tema
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

//---------------------------------------- Tipagem para as tarefas
type Tarefa = {
  id: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";
};

//---------------------------------------- Tela principal do dashboard
// Aqui vamos buscar as tarefas do usuário e mostrar a contagem por status, além de um gráfico de pizza
export default function Index() {
  const { theme } = useTheme(); // Puxando o tema dinâmico
  const [tarefas, setTarefas] = useState<Tarefa[]>([]); // estado para armazenar as tarefas
  const [loading, setLoading] = useState(false); // estado para controlar o loading

  //-------------------------------- Função para buscar as tarefas do usuário
  async function buscarTarefas() {
    try {
      setLoading(true);

      // Usando a sua instância de API que já tem o token configurado
      const response = await api.get("/usuario/tarefas");

      // O axios já retorna o JSON em response.data
      setTarefas(response.data);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || "Erro ao buscar tarefas";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  // Buscar as tarefas quando o componente for montado
  useEffect(() => {
    buscarTarefas();
  }, []);

  // Contar quantas tarefas existem em cada status
  const pendentes = tarefas.filter((t) => t.status === "PENDENTE").length;
  const emAndamento = tarefas.filter((t) => t.status === "EM_ANDAMENTO").length;
  const concluidas = tarefas.filter((t) => t.status === "CONCLUIDA").length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={theme.accent}
          style={{ marginBottom: 10 }}
        />
      )}

      {/* Seção de Cards de Status */}
      <View style={styles.headersRow}>
        <Header
          style={{ backgroundColor: theme.cardPendente, borderRadius: 12 }}
          componente01={
            <Title texto="A fazer" style={{ color: theme.textPendente }} />
          }
          componente02={
            <Texto
              texto={String(pendentes)}
              style={{ color: theme.textPendente }}
            />
          }
        />

        <Header
          style={{ backgroundColor: theme.cardAndamento, borderRadius: 12 }}
          componente01={
            <Title
              texto="Em andamento"
              style={{ color: theme.textAndamento }}
            />
          }
          componente02={
            <Texto
              texto={String(emAndamento)}
              style={{ color: theme.textAndamento }}
            />
          }
        />

        <Header
          style={{ backgroundColor: theme.cardConcluido, borderRadius: 12 }}
          componente01={
            <Title texto="Concluído" style={{ color: theme.textConcluido }} />
          }
          componente02={
            <Texto
              texto={String(concluidas)}
              style={{ color: theme.textConcluido }}
            />
          }
        />
      </View>

      {/* Seção do Gráfico - Ajustada para não ocupar espaço excessivo */}
      <Body
        style={{ backgroundColor: "transparent", alignItems: "center" }}
        componente01={
          <View style={styles.chartContainer}>
            <GraficoPizza
              pendentes={pendentes}
              emAndamento={emAndamento}
              concluidas={concluidas}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headersRow: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 10,
  },
  chartContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -10, // Sobe um pouco o gráfico para aproveitar o espaço
  },
});
