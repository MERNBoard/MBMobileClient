import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "../context/ThemeContext";

interface Props {
  pendentes: number;
  emAndamento: number;
  concluidas: number;
}

export const GraficoDinamico = ({
  pendentes,
  emAndamento,
  concluidas,
}: Props) => {
  const { theme, tipoGrafico } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const animValue = useRef(new Animated.Value(0)).current;

  const total = pendentes + emAndamento + concluidas;
  const dataValues = [pendentes, emAndamento, concluidas];
  const labels = ["A Fazer", "Em Curso", "Feito"];
  const maxVal = Math.max(pendentes, emAndamento, concluidas, 1);

  const chartSize = windowWidth > 600 ? 220 : 160;
  const containerHeight = windowWidth > 600 ? 300 : 240;

  useEffect(() => {
    animValue.setValue(0);
    Animated.timing(animValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, [tipoGrafico, total]);

  if (total === 0) {
    return (
      <View style={[styles.emptyContainer, { height: containerHeight }]}>
        <Text style={{ color: theme.textLight, opacity: 0.5 }}>
          Sem dados para exibir
        </Text>
      </View>
    );
  }

  // --- 1 & 2. PIZZAS (VERSÃO SVG COM PROPORÇÃO EXATA) ---
  if (tipoGrafico === "pizza_donut" || tipoGrafico === "pizza_solid") {
    const isDonut = tipoGrafico === "pizza_donut";
    const radius = chartSize / 2;
    const strokeWidth = isDonut ? chartSize * 0.22 : radius;
    const innerRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * innerRadius;

    const data = [
      { valor: pendentes, cor: theme.cardPendente },
      { valor: emAndamento, cor: theme.cardAndamento },
      { valor: concluidas, cor: theme.cardConcluido },
    ];

    let currentOffset = 0;

    return (
      <View style={[styles.pizzaWrapper, { height: containerHeight }]}>
        <View
          style={{
            width: chartSize,
            height: chartSize,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View
            style={{
              width: chartSize,
              height: chartSize,
              transform: [
                {
                  rotate: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
                { scale: animValue },
              ],
            }}
          >
            <Svg
              width={chartSize}
              height={chartSize}
              viewBox={`0 0 ${chartSize} ${chartSize}`}
            >
              <G rotation="-90" origin={`${radius}, ${radius}`}>
                {data.map((item, index) => {
                  if (item.valor === 0) return null;

                  const percentage = item.valor / total;
                  const strokeDashoffset =
                    circumference - circumference * percentage;
                  const rotation = (currentOffset / total) * 360;
                  currentOffset += item.valor;

                  return (
                    <Circle
                      key={index}
                      cx={radius}
                      cy={radius}
                      r={innerRadius}
                      fill="none"
                      stroke={item.cor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${circumference} ${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      transform={`rotate(${rotation}, ${radius}, ${radius})`}
                    />
                  );
                })}
              </G>
            </Svg>
          </Animated.View>

          <View style={styles.absoluteCenter}>
            <Text
              style={{
                color: theme.textLight,
                fontWeight: "bold",
                fontSize: chartSize * 0.18,
              }}
            >
              {total}
            </Text>
            <Text
              style={{
                color: theme.textLight,
                fontSize: 10,
                opacity: 0.5,
                fontWeight: "bold",
              }}
            >
              TOTAL
            </Text>
          </View>
        </View>

        <View style={styles.legendColumn}>
          <LegendItem
            color={theme.cardPendente}
            label="A fazer"
            value={pendentes}
            theme={theme}
          />
          <LegendItem
            color={theme.cardAndamento}
            label="Em curso"
            value={emAndamento}
            theme={theme}
          />
          <LegendItem
            color={theme.cardConcluido}
            label="Concluído"
            value={concluidas}
            theme={theme}
          />
        </View>
      </View>
    );
  }

  // --- 3. BARRA VERTICAL ---
  if (tipoGrafico === "barra_vertical") {
    const data = [
      { label: "Pendente", valor: pendentes, cor: theme.cardPendente },
      { label: "Andamento", valor: emAndamento, cor: theme.cardAndamento },
      { label: "Concluído", valor: concluidas, cor: theme.cardConcluido },
    ];

    return (
      <View style={[styles.barsArea, { height: containerHeight }]}>
        {data.map((item, index) => (
          <View key={index} style={styles.barWrapper}>
            <Text
              style={[
                styles.barValue,
                { color: theme.textLight, fontSize: 14 },
              ]}
            >
              {item.valor}
            </Text>
            <Animated.View
              style={[
                styles.barColumn,
                {
                  backgroundColor: item.cor,
                  width: windowWidth > 600 ? 60 : 45,
                  height: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      0,
                      (item.valor / maxVal) * (containerHeight * 0.6),
                    ],
                  }),
                },
              ]}
            />
            <Text
              style={[
                styles.barLabel,
                { color: theme.textLight, fontSize: 11 },
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  // --- 4. BARRA LATERAL ---
  if (tipoGrafico === "barra_lateral") {
    const data = [
      { label: "A fazer", valor: pendentes, cor: theme.cardPendente },
      { label: "Em curso", valor: emAndamento, cor: theme.cardAndamento },
      { label: "Concluído", valor: concluidas, cor: theme.cardConcluido },
    ];
    return (
      <View style={[styles.sideBarArea, { height: containerHeight }]}>
        {data.map((item, index) => (
          <View key={index} style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  color: theme.textLight,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {item.label}
              </Text>
              <Text
                style={{
                  color: theme.textLight,
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                {item.valor}
              </Text>
            </View>
            <View style={[styles.sideBarTrack, { height: 14 }]}>
              <Animated.View
                style={[
                  styles.sideBarFill,
                  {
                    backgroundColor: item.cor,
                    width: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", `${(item.valor / total) * 100}%`],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  }

  // --- 5 & 6. LINHAS E ÁREA ---
  const isArea = tipoGrafico === "area";
  return (
    <View style={[styles.linesAreaContainer, { height: containerHeight }]}>
      <View style={styles.gridOverlay}>
        {[0, 0.5, 1].map((step) => (
          <View
            key={step}
            style={[
              styles.gridLine,
              {
                bottom: `${step * 100}%`,
                borderTopColor: theme.textLight + "15",
              },
            ]}
          />
        ))}
      </View>

      <View
        style={[styles.chartFrame, { borderColor: theme.textLight + "40" }]}
      >
        {dataValues.map((val, i) => {
          const heightPerc = (val / maxVal) * 100;
          const barColor =
            i === 0
              ? theme.cardPendente
              : i === 1
                ? theme.cardAndamento
                : theme.cardConcluido;

          return (
            <View key={i} style={styles.lineCol}>
              <Animated.View
                style={{
                  opacity: animValue,
                  bottom: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", `${heightPerc + 8}%`],
                  }),
                  position: "absolute",
                  zIndex: 10,
                }}
              >
                <View style={[styles.tooltip, { backgroundColor: barColor }]}>
                  <Text style={styles.tooltipText}>{val}</Text>
                </View>
              </Animated.View>

              <Animated.View
                style={[
                  isArea ? styles.areaFill : styles.point,
                  {
                    backgroundColor: barColor,
                    bottom: isArea
                      ? 0
                      : animValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", `${heightPerc}%`],
                        }),
                    height: isArea
                      ? animValue.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", `${heightPerc}%`],
                        })
                      : 18,
                    width: isArea ? "85%" : 18,
                    borderRadius: isArea ? 12 : 9,
                    borderWidth: isArea ? 0 : 3,
                    borderColor: theme.background,
                    opacity: isArea ? 0.8 : 1,
                  },
                ]}
              />
              <Text style={[styles.xAxisLabel, { color: theme.textLight }]}>
                {labels[i]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const LegendItem = ({ color, label, value, theme }: any) => (
  <View
    style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
  >
    <View
      style={{
        width: 14,
        height: 14,
        borderRadius: 4,
        backgroundColor: color,
        marginRight: 10,
      }}
    />
    <View>
      <Text
        style={{ color: theme.textLight, fontSize: 14, fontWeight: "bold" }}
      >
        {value}
      </Text>
      <Text style={{ color: theme.textLight, fontSize: 12, opacity: 0.7 }}>
        {label}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: { justifyContent: "center", alignItems: "center" },
  pizzaWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  absoluteCenter: { position: "absolute", alignItems: "center" },
  legendColumn: { minWidth: 120 },
  barsArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    width: "100%",
    paddingBottom: 30,
  },
  barWrapper: { alignItems: "center", flex: 1 },
  barColumn: { borderRadius: 10, marginBottom: 8 },
  barValue: { fontWeight: "bold", marginBottom: 8 },
  barLabel: { fontWeight: "600" },
  sideBarArea: {
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  sideBarTrack: {
    width: "100%",
    backgroundColor: "#00000020",
    borderRadius: 7,
    overflow: "hidden",
  },
  sideBarFill: { height: "100%", borderRadius: 7 },
  linesAreaContainer: {
    width: "100%",
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 40,
  },
  gridOverlay: {
    position: "absolute",
    left: 25,
    right: 25,
    top: 40,
    bottom: 65,
  },
  gridLine: {
    position: "absolute",
    width: "100%",
    borderTopWidth: 1,
    borderStyle: "dashed",
  },
  chartFrame: {
    flex: 1,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  lineCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
  point: { position: "absolute", zIndex: 5 },
  areaFill: { borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  tooltip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 28,
    alignItems: "center",
  },
  tooltipText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  xAxisLabel: {
    position: "absolute",
    bottom: -25,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    opacity: 0.6,
  },
});
