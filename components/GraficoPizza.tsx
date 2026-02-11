import React from "react";
import { Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export function GraficoPizza() {
  const data = [
    {
      name: "A fazer", // nome da categoria
      population: 3, // valor da categoria
      color: "#7e57c2", // cor da fatia
      legendFontColor: "#21155d", // cor da legenda
      legendFontSize: 12,// tamanho da fonte da legenda
    },
    {
      name: "Em andamento",
      population: 2,
      color: "#42a5f5",
      legendFontColor: "#21155d",
      legendFontSize: 12,
    },
    {
      name: "Concluído",
      population: 5,
      color: "#66bb6a",
      legendFontColor: "#21155d",
      legendFontSize: 12,
    },
  ];

  return (
    <View>
      <PieChart
        data={data}// dados para o gráfico
        width={screenWidth - 40}// largura do gráfico (ajustada para o padding)
        height={230}// altura do gráfico
        accessor="population"// chave para acessar os valores dos dados
        backgroundColor="transparent"// cor de fundo do gráfico
        paddingLeft="15"// espaço à esquerda do gráfico para a legenda
        absolute// exibe os valores absolutos nas fatias
        chartConfig={{
          backgroundColor: "#ffffff",// cor de fundo do gráfico
          backgroundGradientFrom: "#ffffff",// cor de início do gradiente de fundo
          backgroundGradientTo: "#ffffff",// cor de fim do gradiente de fundo
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,// função para definir a cor das fatias com base na opacidade
        }}
      />
    </View>
  );
}
