import React from "react";
import { Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

type Props = {
  pendentes: number;
  emAndamento: number;
  concluidas: number;
};

export function GraficoPizza({ pendentes, emAndamento, concluidas }: Props) {
  const data = [
    {
      name: "Pendentes",
      population: pendentes,
      color: "#7e57c2",
      legendFontColor: "#21155d",
      legendFontSize: 12,
    },
    {
      name: "Em andamento",
      population: emAndamento,
      color: "#42a5f5",
      legendFontColor: "#21155d",
      legendFontSize: 12,
    },
    {
      name: "Concluído",
      population: concluidas,
      color: "#66bb6a",
      legendFontColor: "#21155d",
      legendFontSize: 12,
    },
  ];

  return (
    <View>
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={230}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
      />
    </View>
  );
}
