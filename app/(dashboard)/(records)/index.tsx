import { Octicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import CustomAlert from "../../../components/CustomAlert";
import { useTheme } from "../../../context/ThemeContext";
import api from "../../../services/api";

/**
 * Interface Task - Define a estrutura de dados de uma tarefa vinda da API.
 */
interface Task {
  id: string;
  titulo: string;
  categoria: string;
  prioridade: string;
  status: string;
  deadline: string;
  tags: string[];
  descricao?: string;
}

/**
 * RecordsPage - Componente Principal de Listagem de Tarefas.
 * Gerencia o ciclo de vida de busca, filtragem e renderização responsiva.
 */
export default function RecordsPage() {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  // ESTADOS PRINCIPAIS
  const [tasks, setTasks] = useState<Task[]>([]); // Lista bruta da API
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]); // Lista exibida após busca
  const [searchQuery, setSearchQuery] = useState(""); // Valor do campo de busca
  const [loading, setLoading] = useState(true); // Feedback de carregamento inicial
  const [refreshing, setRefreshing] = useState(false); // Controle do Pull-to-Refresh

  /**
   * Layout Responsivo: Define o número de colunas com base na largura da tela.
   * Mobile: 1 coluna | Tablet: 2 colunas | Desktop/Web: 3 colunas.
   */
  const numColumns = width > 1024 ? 3 : width > 720 ? 2 : 1;

  // CONFIGURAÇÃO DE ALERTAS CUSTOMIZADOS
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "default" as "default" | "danger",
    onConfirm: () => {},
  });

  const triggerAlert = (
    title: string,
    message: string,
    onConfirm: () => void,
    type: "default" | "danger" = "default",
  ) => {
    setAlertConfig({ title, message, onConfirm, type });
    setAlertVisible(true);
  };

  /**
   * fetchTasks: Busca as tarefas do usuário.
   * Implementa redirecionamento para login em caso de erro 401 (não autorizado).
   */
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/usuario/tarefas");
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.replace("/(auth)");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * useFocusEffect: Recarrega os dados sempre que a página volta a ter foco
   * (ex: ao voltar da tela de edição/criação).
   */
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, []),
  );

  /**
   * useEffect (Filtragem): Monitora a searchQuery e atualiza a lista filtrada.
   * Busca em títulos, categorias e tags.
   */
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tasks.filter((task) => {
        return (
          task.titulo?.toLowerCase().includes(query) ||
          task.categoria?.toLowerCase().includes(query) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      });
      setFilteredTasks(filtered);
    }
  }, [searchQuery, tasks]);

  /**
   * confirmDelete: Executa a exclusão lógica no servidor e atualiza o estado local.
   */
  const confirmDelete = async (id: string) => {
    setAlertVisible(false);
    try {
      await api.delete(`/usuario/tarefas/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error: any) {
      Alert.alert("Erro", "Não foi possível excluir a tarefa.");
    }
  };

  /**
   * getPriorityInfo: Retorna as cores e labels com base no nível de urgência.
   */
  const getPriorityInfo = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "ALTA":
        return { color: "#FF3B30", bg: "#FF3B3020", label: "ALTA" };
      case "MEDIA":
        return { color: "#FF9500", bg: "#FF950020", label: "MÉDIA" };
      case "BAIXA":
        return { color: "#34C759", bg: "#34C75920", label: "BAIXA" };
      default:
        return { color: theme.detail, bg: theme.primary, label: priority };
    }
  };

  /**
   * getStatusInfo: Traduz o status da API para labels amigáveis e cores de status.
   */
  const getStatusInfo = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONCLUIDA":
        return { color: "#34C759", label: "CONCLUÍDA" };
      case "EM_ANDAMENTO":
        return { color: "#FF9500", label: "EM ANDAMENTO" };
      case "PENDENTE":
        return { color: "#FF3B30", label: "PENDENTE" };
      default:
        return { color: theme.textLight, label: status };
    }
  };

  /**
   * renderItem: Componente de card individual da FlatList.
   */
  const renderItem = ({ item }: { item: Task }) => {
    const priority = getPriorityInfo(item.prioridade);
    const status = getStatusInfo(item.status);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/(dashboard)/(records)/details",
            params: { id: item.id },
          })
        }
        style={[
          styles.card,
          {
            backgroundColor: theme.primary,
            borderTopColor: priority.color,
            borderColor: theme.secondary,
          },
          numColumns > 1 && { maxWidth: width / numColumns - 40 },
        ]}
      >
        {/* Cabeçalho do Card (Status e Prioridade) */}
        <View style={styles.cardHeader}>
          <Text style={[styles.statusLabel, { color: status.color }]}>
            {status.label}
          </Text>
          <View
            style={[styles.priorityBadge, { backgroundColor: priority.bg }]}
          >
            <View
              style={[styles.priorityDot, { backgroundColor: priority.color }]}
            />
            <Text style={[styles.priorityText, { color: priority.color }]}>
              {priority.label}
            </Text>
          </View>
        </View>

        {/* Conteúdo (Título e Categoria) */}
        <Text
          style={[styles.taskTitle, { color: theme.textLight }]}
          numberOfLines={2}
        >
          {item.titulo}
        </Text>
        <Text
          style={[
            styles.categoryText,
            { color: theme.textLight, opacity: 0.6 },
          ]}
        >
          {item.categoria || "Geral"}
        </Text>

        {/* Tags */}
        <View style={styles.tagWrapper}>
          {item.tags?.map((tag, idx) => (
            <View
              key={idx}
              style={[styles.tagBadge, { backgroundColor: theme.secondary }]}
            >
              <Text style={[styles.tagText, { color: theme.accent }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {/* Rodapé do Card (Deadline e Ações) */}
        <View style={[styles.cardFooter, { borderTopColor: theme.secondary }]}>
          <View style={styles.deadlineBox}>
            <Octicons name="calendar" size={12} color={theme.detail} />
            <Text style={[styles.deadlineText, { color: theme.detail }]}>
              {item.deadline
                ? new Date(item.deadline).toLocaleDateString("pt-BR")
                : "Sem prazo"}
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(dashboard)/(records)/edit",
                  params: { id: item.id },
                })
              }
              style={[
                styles.circleBtn,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.secondary,
                },
              ]}
            >
              <Octicons name="pencil" size={14} color={theme.accent} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                triggerAlert(
                  "Excluir",
                  `Apagar "${item.titulo}"?`,
                  () => confirmDelete(item.id),
                  "danger",
                )
              }
              style={[
                styles.circleBtn,
                { backgroundColor: theme.background, borderColor: "#FF3B3040" },
              ]}
            >
              <Octicons name="trash" size={14} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header da Página */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textLight }]}>
          Minhas Tarefas
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.accent }]}
          onPress={() => router.push("/(dashboard)/(records)/add")}
        >
          <Octicons name="plus" size={18} color={theme.background} />
          <Text style={[styles.addButtonText, { color: theme.background }]}>
            Nova Tarefa
          </Text>
        </TouchableOpacity>
      </View>

      {/* Barra de Pesquisa */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.primary, borderColor: theme.secondary },
          ]}
        >
          <Octicons name="search" size={16} color={theme.detail} />
          <TextInput
            style={[styles.searchInput, { color: theme.textLight }]}
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.detail}
          />
        </View>
      </View>

      {/* Listagem */}
      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color={theme.accent}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          key={numColumns} // Força re-renderizar ao mudar grid (essencial para colunas dinâmicas)
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.detail }]}>
              Nenhuma tarefa encontrada.
            </Text>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={theme.accent}
              onRefresh={() => {
                setRefreshing(true);
                fetchTasks();
              }}
            />
          }
        />
      )}

      {/* Modal de Alerta Customizado */}
      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertVisible(false)}
        confirmText="Excluir"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginTop: Platform.OS === "android" ? 40 : 0,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  addButtonText: {
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 48,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    ...Platform.select({
      web: {
        outlineStyle: "none",
      } as any,
    }),
  },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  columnWrapper: { justifyContent: "flex-start", gap: 20 },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flex: 1,
    minHeight: 200,
    borderTopWidth: 4,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  statusLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priorityDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  priorityText: { fontSize: 10, fontWeight: "800" },
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 24,
  },
  categoryText: { fontSize: 13, marginBottom: 12 },
  tagWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 15,
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: { fontSize: 11, fontWeight: "600" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 15,
    borderTopWidth: 1,
  },
  deadlineBox: { flexDirection: "row", alignItems: "center", gap: 6 },
  deadlineText: { fontSize: 12, fontWeight: "500" },
  actionRow: { flexDirection: "row", gap: 8 },
  circleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
    fontWeight: "500",
  },
});
