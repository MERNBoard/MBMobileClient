import { Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import api from "../../../services/api";

/**
 * Página de Detalhes da Tarefa.
 * * Exibe informações completas de uma tarefa específica, incluindo status,
 * prioridade, descrição e dados do usuário responsável.
 * Permite a navegação para a tela de edição.
 */
export default function TaskDetailsPage() {
  /** @constant id - Recupera o ID da tarefa passado via parâmetro de rota. */
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();

  // ESTADOS DA PÁGINA
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
  } | null>(null);

  /**
   * Hook de efeito que carrega os dados da tarefa e do usuário ao montar o componente.
   * * 1. Busca todas as tarefas do usuário na API.
   * 2. Filtra a tarefa correspondente ao ID da URL.
   * 3. Recupera os dados do perfil do usuário do AsyncStorage.
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get("/usuario/tarefas");
        const foundTask = response.data.find((t: any) => t.id === id);
        setTask(foundTask);

        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  /** * Exibe indicador de carregamento enquanto a API não responde.
   */
  if (loading)
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1 }}
        color={theme.accent}
      />
    );

  /** * Fallback visual para IDs inexistentes ou erros de busca.
   */
  if (!task)
    return (
      <Text style={[styles.errorText, { color: theme.textLight }]}>
        Tarefa não encontrada.
      </Text>
    );

  /**
   * Retorna o código hexadecimal da cor baseado no nível de prioridade.
   * @param p - String da prioridade (ALTA, MEDIA, BAIXA).
   */
  const getPriorityColor = (p: string) => {
    if (p === "ALTA") return "#FF3B30";
    if (p === "MEDIA") return "#FF9500";
    return "#34C759";
  };

  /**
   * Gera as iniciais do nome do usuário para o avatar.
   * @param name - Nome completo do usuário.
   */
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length > 1)
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* HEADER DA PÁGINA: Contém título e botão de navegação para Edição */}
      <View style={[styles.header, { borderBottomColor: theme.primary }]}>
        <View style={{ width: 24 }} />
        <Text style={[styles.headerTitle, { color: theme.textLight }]}>
          Detalhes da Tarefa
        </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(dashboard)/(records)/edit",
              params: { id: task.id },
            })
          }
        >
          <Octicons name="pencil" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ROW SUPERIOR: Badge de Prioridade e Label de Status */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(task.prioridade) + "20" },
            ]}
          >
            <View
              style={[
                styles.dot,
                { backgroundColor: getPriorityColor(task.prioridade) },
              ]}
            />
            <Text
              style={[
                styles.priorityText,
                { color: getPriorityColor(task.prioridade) },
              ]}
            >
              {task.prioridade}
            </Text>
          </View>
          <Text
            style={[
              styles.statusLabel,
              { color: theme.textLight, opacity: 0.5 },
            ]}
          >
            {task.status}
          </Text>
        </View>

        {/* CORPO: Título e Meta-informações (Data e Categoria) */}
        <Text style={[styles.title, { color: theme.textLight }]}>
          {task.titulo}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.infoRow}>
            <Octicons name="tag" size={16} color={theme.accent} />
            <Text
              style={[
                styles.infoText,
                { color: theme.textLight, opacity: 0.8 },
              ]}
            >
              {task.categoria} • {task.tags?.[0] || "Geral"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Octicons name="calendar" size={16} color={theme.accent} />
            <Text
              style={[
                styles.infoText,
                { color: theme.textLight, opacity: 0.8 },
              ]}
            >
              Prazo:{" "}
              {task.deadline
                ? new Date(task.deadline).toLocaleDateString("pt-BR")
                : "Sem prazo"}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.primary }]} />

        {/* SEÇÃO: Descrição detalhada */}
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>
          Descrição
        </Text>
        <Text style={[styles.description, { color: theme.textLight }]}>
          {task.descricao || "Esta tarefa não possui uma descrição detalhada."}
        </Text>

        <View style={[styles.divider, { backgroundColor: theme.primary }]} />

        {/* SEÇÃO: Card do Responsável (Exibe dados do AsyncStorage) */}
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>
          Responsável pela Tarefa
        </Text>
        <View
          style={[
            styles.userCard,
            { backgroundColor: theme.primary, borderColor: theme.secondary },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
            <Text style={[styles.avatarText, { color: theme.background }]}>
              {getInitials(userData?.name || "U")}
            </Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: theme.textLight }]}>
              {userData?.name || "Usuário"}
            </Text>
            <Text
              style={[
                styles.userEmail,
                { color: theme.textLight, opacity: 0.6 },
              ]}
            >
              {userData?.email || "Logado no sistema"}
            </Text>
          </View>
        </View>

        {/* FOOTER: Status de atribuição */}
        <TouchableOpacity
          style={[styles.claimButton, { backgroundColor: theme.primary }]}
          onPress={() => alert("Você já é o responsável por esta tarefa.")}
        >
          <Text style={[styles.claimButtonText, { color: theme.accent }]}>
            Tarefa Atribuída
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  content: { padding: 24 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  priorityText: { fontSize: 12, fontWeight: "800" },
  statusLabel: { fontSize: 12, fontWeight: "700" },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 15,
    letterSpacing: -0.5,
  },
  metaContainer: { gap: 10 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  infoText: { fontSize: 15, fontWeight: "500" },
  divider: { height: 1, marginVertical: 30 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  description: { fontSize: 16, lineHeight: 26 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontWeight: "bold", fontSize: 16 },
  userName: { fontWeight: "700", fontSize: 17 },
  userEmail: { fontSize: 13, marginTop: 2 },
  claimButton: {
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
  },
  claimButtonText: { fontWeight: "bold" },
  errorText: { textAlign: "center", marginTop: 50 },
});
