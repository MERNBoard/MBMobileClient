import React from "react";
import { Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useTheme } from "../context/ThemeContext";

const screenWidth = Dimensions.get("window").width;

type Props = {
  pendentes: number;
  emAndamento: number;
  concluidas: number;
};

export function GraficoPizza({ pendentes, emAndamento, concluidas }: Props) {
  const { theme } = useTheme();

  // Definimos cores semânticas para as fatias baseadas no tema para não sumirem
  const data = [
    {
      name: "Pendentes",
      population: pendentes,
      color: theme.accent,
      legendFontColor: theme.textLight, // Garante que a legenda siga o texto claro do tema
      legendFontSize: 12,
    },
    {
      name: "Andamento",
      population: emAndamento,
      color: theme.secondary,
      legendFontColor: theme.textLight,
      legendFontSize: 12,
    },
    {
      name: "Concluído",
      population: concluidas,
      color: theme.detail, // Usando detail para ser dinâmico também
      legendFontColor: theme.textLight,
      legendFontSize: 12,
    },
  ];

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={220}
        accessor="population"
        // Forçamos o fundo a ser transparente para herdar o fundo do Body/Container
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        chartConfig={{
          // Cores das etiquetas (se houver) e auxiliares
          color: (opacity = 1) => theme.textLight,
          labelColor: (opacity = 1) => theme.textLight,
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: theme.accent,
          },
        }}
        // Garante que o gráfico renderize corretamente em fundos escuros
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}
