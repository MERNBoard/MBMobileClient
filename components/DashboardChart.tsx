import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { GraficoDinamico } from "./GraficoDinamico";

interface ChartProps {
  data: { label: string; valor: number }[];
}

export default function DashboardChart({ data }: ChartProps) {
  const { theme, tipoGrafico } = useTheme();

  const pendentes = data.find((d) => d.label === "Pendente")?.valor || 0;
  const emAndamento = data.find((d) => d.label === "Andamento")?.valor || 0;
  const concluidas = data.find((d) => d.label === "Concluído")?.valor || 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.primary + "15" }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textLight }]}>
          Status das Tarefas
        </Text>
        <Text style={[styles.subtitle, { color: theme.accent }]}>
          {tipoGrafico.replace(/_/g, " ")}
        </Text>
      </View>

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
