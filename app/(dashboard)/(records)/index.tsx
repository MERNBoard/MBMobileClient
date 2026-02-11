import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

interface Task {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  deadline: string;
  tag: string;
}

export default function RecordsPage() {
  const { width } = useWindowDimensions();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const numColumns = width > 768 ? 3 : width > 500 ? 2 : 1;

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

  const fetchTasks = async () => {
    try {
      const mockData: Task[] = [
        {
          id: "1",
          title: "Finalizar UI",
          category: "Dev",
          priority: "Alta",
          status: "Em foco",
          deadline: "12/02",
          tag: "Frontend",
        },
        {
          id: "2",
          title: "Revisão de API",
          category: "Back",
          priority: "Média",
          status: "Pendente",
          deadline: "15/02",
          tag: "NodeJS",
        },
        {
          id: "3",
          title: "Post-it Teste",
          category: "Design",
          priority: "Baixa",
          status: "Concluído",
          deadline: "20/02",
          tag: "UI/UX",
        },
      ];
      setTasks(mockData);
      setFilteredTasks(mockData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = tasks.filter((task) => {
        return (
          task.title.toLowerCase().includes(query) ||
          task.tag.toLowerCase().includes(query) ||
          task.deadline.includes(query)
        );
      });
      setFilteredTasks(filtered);
    }
  }, [searchQuery, tasks]);

  const handleDeleteRequest = (task: Task) => {
    triggerAlert(
      "Excluir Tarefa",
      `Deseja realmente apagar "${task.title}"?`,
      () => confirmDelete(task.id),
      "danger",
    );
  };

  const confirmDelete = async (id: string) => {
    setAlertVisible(false);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const renderItem = ({ item }: { item: Task }) => (
    <View style={[styles.card, { width: numColumns > 1 ? undefined : "100%" }]}>
      <View style={styles.cardContent}>
        <Text style={styles.taskTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>{item.tag}</Text>
        </View>
        <Text style={styles.categoryText}>{item.category}</Text>
        <Text style={styles.deadlineText}>Prazo: {item.deadline}</Text>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(dashboard)/(records)/edit",
              params: { id: item.id },
            })
          }
          style={styles.actionButton}
        >
          <Octicons name="pencil" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteRequest(item)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Octicons name="trash" size={16} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Minhas Tarefas</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/(dashboard)/(records)/add")}
        >
          <Octicons name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Nova</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Octicons
            name="search"
            size={16}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
            cursorColor="#000"
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#000"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          key={numColumns}
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchTasks();
              }}
            />
          }
        />
      )}

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertVisible(false)}
        confirmText="Excluir"
        cancelText="Manter"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
    marginTop: Platform.OS === "android" ? 45 : 10,
  },
  titleContainer: { flex: 1, paddingBottom: 6 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1a1a1a" },
  addButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: { color: "#fff", marginLeft: 8, fontWeight: "600" },

  searchContainer: { paddingHorizontal: 24, marginBottom: 15 },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    ...Platform.select({ web: { outlineStyle: "none" } as any }),
  },

  list: { paddingHorizontal: 20, paddingBottom: 100 },
  columnWrapper: { justifyContent: "flex-start", gap: 12 },

  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    flex: 1,
    minHeight: 180,
    maxWidth: Platform.OS === "web" ? "32%" : "100%",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#eee",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: { flex: 1 },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  tagContainer: { marginBottom: 6 },
  tagText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "bold",
    backgroundColor: "#E0EFFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  categoryText: { fontSize: 13, color: "#666", marginBottom: 4 },
  deadlineText: { fontSize: 11, color: "#aaa", marginTop: 4 },

  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  deleteButton: { borderColor: "#FFE5E5" },
  emptyText: {
    textAlign: "center",
    color: "#AAA",
    marginTop: 40,
    fontSize: 16,
  },
});
