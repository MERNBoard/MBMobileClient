import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import api from "../services/api";

/**
 * SplashPage - Tela de abertura e lógica de roteamento inicial.
 */
export default function SplashPage() {
  const { theme, themeName } = useTheme();
  const [isReady, setIsReady] = useState(false);

  // Referências para animações usando a API nativa Animated
  const logoPop = useRef(new Animated.Value(0)).current; // Escala da logo
  const textSlide = useRef(new Animated.Value(20)).current; // Deslize do texto
  const opacity = useRef(new Animated.Value(0)).current; // Opacidade geral

  useEffect(() => {
    if (theme) {
      setIsReady(true);

      // Dispara as animações em paralelo para um efeito visual fluido
      Animated.parallel([
        Animated.spring(logoPop, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      /**
       * Lógica de Navegação:
       * Verifica a existência de um token salvo para pular a tela de login.
       */
      const checkNavigation = async () => {
        try {
          const token = await AsyncStorage.getItem("@MBToken");

          // Delay artificial para garantir que o usuário veja a marca (branding)
          await new Promise((resolve) => setTimeout(resolve, 2500));

          if (token) {
            // Se houver token, injeta-o globalmente na API e vai para a Dashboard
            api.defaults.headers.Authorization = `Bearer ${token}`;
            router.replace("/(dashboard)");
          } else {
            // Sem token, vai para Login/Cadastro
            router.replace("/(auth)");
          }
        } catch (error) {
          console.error("Erro na Splash:", error);
          router.replace("/(auth)");
        }
      };

      checkNavigation();
    }
  }, [theme]);

  // Enquanto o tema não é carregado, exibe uma tela preta neutra
  if (!isReady || !theme) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  // Cores derivadas do tema para a logo customizada (vetorial via View)
  const strongColor = theme.accent;
  const middleColor = theme.accent + "95"; // 95% de opacidade
  const lightColor = "#F5F5F7";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={
          themeName === "dark" || theme.background === "#000"
            ? "light-content"
            : "dark-content"
        }
        backgroundColor={theme.background}
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacity,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        {/* Logo MERNBoard construída com Views (Efeito de POP) */}
        <Animated.View
          style={[
            styles.outerCard,
            {
              backgroundColor: theme.primary,
              transform: [{ scale: logoPop }],
            },
          ]}
        >
          <View
            style={[
              styles.logoInnerContainer,
              { backgroundColor: theme.background },
            ]}
          >
            <View style={styles.mWrapper}>
              {/* Representação visual da perna esquerda do 'M' */}
              <View
                style={[styles.mLegLeft, { backgroundColor: lightColor }]}
              />
              <View style={styles.mCenterContainer}>
                {/* O detalhe do "Lápis" no centro da logo */}
                <View
                  style={[styles.pencilBody, { backgroundColor: middleColor }]}
                />
                <View style={styles.tipWrapper}>
                  <View
                    style={[
                      styles.pencilTipDiamond,
                      { backgroundColor: middleColor },
                    ]}
                  />
                </View>
              </View>
              {/* Representação visual da perna direita do 'M' */}
              <View
                style={[styles.mLegRight, { backgroundColor: strongColor }]}
              />
            </View>
          </View>
        </Animated.View>

        {/* Branding: Texto do Aplicativo */}
        <View style={styles.textRow}>
          <Text style={[styles.brandMern, { color: strongColor }]}>MERN</Text>
          <Text style={[styles.brandBoard, { color: middleColor }]}>Board</Text>
        </View>

        {/* Indicador de carregamento e feedback textual */}
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={theme.accent}
            style={styles.spinner}
          />
          <Text style={[styles.loadingText, { color: theme.textLight }]}>
            Carregando
          </Text>
          <View style={styles.dotContainer}>
            <View style={[styles.dot, { backgroundColor: theme.accent }]} />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  outerCard: {
    width: 170,
    height: 170,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoInnerContainer: {
    width: 125,
    height: 125,
    borderRadius: 22,
    overflow: "hidden",
  },
  mWrapper: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
  },
  mLegLeft: {
    width: "33.4%",
    height: "100%",
  },
  mCenterContainer: {
    width: "33.2%",
    height: "72%",
    zIndex: 10,
    alignItems: "center",
  },
  pencilBody: {
    width: "100%",
    height: "70%",
  },
  tipWrapper: {
    width: "100%",
    height: 40,
    overflow: "hidden",
    alignItems: "center",
    transform: [{ translateY: -0.5 }],
  },
  pencilTipDiamond: {
    width: 46,
    height: 46,
    transform: [{ rotate: "45deg" }],
    borderRadius: 5,
    marginTop: -23,
  },
  mLegRight: {
    width: "33.4%",
    height: "100%",
  },
  textRow: {
    flexDirection: "row",
    marginTop: 40,
    alignItems: "baseline",
  },
  brandMern: {
    fontSize: 38,
    fontWeight: "900",
    letterSpacing: -1,
  },
  brandBoard: {
    fontSize: 38,
    fontWeight: "300",
    marginLeft: 2,
  },
  loaderContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  spinner: {
    transform: [{ scale: 1.3 }],
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  dotContainer: {
    flexDirection: "row",
    marginTop: 6,
  },
  dot: {
    width: 24,
    height: 4,
    borderRadius: 2,
  },
});
