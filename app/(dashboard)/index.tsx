import { Body, Header } from "@/components/Layout";
import { Texto, Title } from "@/components/Text";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

// Importação essencial para atualizar ao voltar na tela
import { useFocusEffect } from "@react-navigation/native";

import { GraficoDinamico } from "../../components/GraficoDinamico";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

/**
 * Tipo Tarefa - Define os status possíveis para o cálculo das métricas.
 */
type Tarefa = {
  id: string;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA";
};

/**
 * Index (Dashboard) - Tela inicial após o login.
 * Gerencia a lógica de sumarização de dados e visualização gráfica.
 */
export default function Index() {
  const { theme } = useTheme();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * buscarTarefas: Consulta a API para obter a lista atualizada de tarefas.
   */
  async function buscarTarefas() {
    try {
      setLoading(true);
      const response = await api.get("/usuario/tarefas");
      setTarefas(response.data);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || "Erro ao buscar tarefas";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  /**
   * useFocusEffect: Garante que os números da Dashboard sejam recalculados
   * sempre que o usuário navegar de volta para esta tela (ex: após criar uma tarefa).
   */
  useFocusEffect(
    useCallback(() => {
      buscarTarefas();
    }, []),
  );

  /**
   * Lógica de Sumarização:
   * Filtra o array de tarefas localmente para evitar múltiplas chamadas de agregação ao banco.
   */
  const pendentes = tarefas.filter((t) => t.status === "PENDENTE").length;
  const emAndamento = tarefas.filter((t) => t.status === "EM_ANDAMENTO").length;
  const concluidas = tarefas.filter((t) => t.status === "CONCLUIDA").length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      {/* Feedback de carregamento sutil */}
      {loading && (
        <ActivityIndicator
          size="small"
          color={theme.accent}
          style={{ marginBottom: 10 }}
        />
      )}

      {/* Linha de Indicadores Rápidos (Cards de Status) */}
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

      {/* Seção Gráfica: Utiliza o GraficoDinamico que respeita a escolha do usuário nas Settings */}
      <Body
        style={{ backgroundColor: "transparent", alignItems: "center" }}
        componente01={
          <View style={styles.chartContainer}>
            <GraficoDinamico
              pendentes={pendentes}
              emAndamento={emAndamento}
              concluidas={concluidas}
            />
          </View>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headersRow: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 10,
    padding: 10,
  },
  chartContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
});
