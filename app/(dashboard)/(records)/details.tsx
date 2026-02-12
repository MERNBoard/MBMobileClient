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

export default function TaskDetailsPage() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
  } | null>(null);

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1 }}
        color={theme.accent}
      />
    );

  if (!task)
    return (
      <Text style={[styles.errorText, { color: theme.textLight }]}>
        Tarefa não encontrada.
      </Text>
    );

  const getPriorityColor = (p: string) => {
    if (p === "ALTA") return "#FF3B30";
    if (p === "MEDIA") return "#FF9500";
    return "#34C759";
  };

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

        <Text style={[styles.sectionTitle, { color: theme.accent }]}>
          Descrição
        </Text>
        <Text style={[styles.description, { color: theme.textLight }]}>
          {task.descricao || "Esta tarefa não possui uma descrição detalhada."}
        </Text>

        <View style={[styles.divider, { backgroundColor: theme.primary }]} />

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
