import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GraficoDinamico } from "./GraficoDinamico";

/**
 * Interface ChartProps:
 * Espera um array de objetos com label e valor, facilitando a
 * integração com diferentes formatos de resposta de APIs.
 */
interface ChartProps {
  data: { label: string; valor: number }[];
}

/**
 * DashboardChart - O invólucro (wrapper) do gráfico.
 * Adiciona um container estilizado e informações sobre o tipo de visualização atual.
 */
export default function DashboardChart({ data }: ChartProps) {
  const { theme, tipoGrafico } = useTheme();

  /**
   * Extração de Valores:
   * Mapeia os dados do array para variáveis específicas esperadas pelo GraficoDinamico.
   */
  const pendentes = data.find((d) => d.label === "Pendente")?.valor || 0;
  const emAndamento = data.find((d) => d.label === "Andamento")?.valor || 0;
  const concluidas = data.find((d) => d.label === "Concluído")?.valor || 0;

  return (
    /**
     * Container com fundo levemente opaco (15%) baseado na cor primária do tema,
     * criando profundidade sem poluir o visual.
     */
    <View style={[styles.container, { backgroundColor: theme.primary + "15" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textLight }]}>
          Status das Tarefas
        </Text>

        {/* Exibe o nome do gráfico formatado (ex: "pizza donut" vira "pizza donut") */}
        <Text style={[styles.subtitle, { color: theme.accent }]}>
          {tipoGrafico.replace(/_/g, " ")}
        </Text>
      </View>

      {/* Renderização do gráfico propriamente dito */}
      <GraficoDinamico
        pendentes={pendentes}
        emAndamento={emAndamento}
        concluidas={concluidas}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 24,
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  subtitle: { fontSize: 10, textTransform: "uppercase", fontWeight: "800" },
});
