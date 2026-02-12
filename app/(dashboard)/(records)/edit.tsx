import { Octicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../../../components/CustomAlert";
import { useTheme } from "../../../context/ThemeContext";
import api from "../../../services/api";

type FormKeys = "status" | "prioridade" | "tag" | "category";

export default function RecordEditPage() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    status: "PENDENTE",
    prioridade: "MEDIA",
    category: "Geral",
    tag: "Trabalho",
    deadline: "",
  });

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

  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeField, setActiveField] = useState<FormKeys | null>(null);

  const options = {
    status: ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"],
    prioridade: ["BAIXA", "MEDIA", "ALTA"],
    tag: ["Trabalho", "Estudo", "Pessoal", "Importante"],
    category: ["Design", "Dev", "Financeiro", "Geral"],
  };

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await api.get("/usuario/tarefas");
        const task = response.data.find((t: any) => t.id === id);
        if (task) {
          setForm({
            titulo: task.titulo,
            descricao: task.descricao || "",
            status: task.status,
            prioridade: task.prioridade,
            category: task.categoria || "Geral",
            tag: task.tags?.[0] || "Trabalho",
            deadline: task.deadline ? task.deadline.split("T")[0] : "",
          });
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar a tarefa.");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchTaskData();
  }, [id]);

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const openPicker = (field: FormKeys) => {
    setActiveField(field);
    setPickerVisible(true);
  };

  const selectOption = (value: string) => {
    if (activeField) updateForm(activeField, value);
    setPickerVisible(false);
  };

  const handleUpdate = async () => {
    triggerAlert(
      "Confirmar",
      "Deseja salvar as alterações nesta tarefa?",
      async () => {
        setAlertVisible(false);
        setLoading(true);
        try {
          await api.put(`/usuario/tarefas/${id}`, {
            titulo: form.titulo,
            descricao: form.descricao,
            status: form.status,
            prioridade: form.prioridade,
            categoria: form.category,
            tags: [form.tag],
            deadline: form.deadline,
          });
          setHasChanges(false);
          router.back();
        } catch (error) {
          Alert.alert("Erro", "Falha ao atualizar.");
        } finally {
          setLoading(false);
        }
      },
    );
  };

  const handleCancel = () => {
    if (hasChanges) {
      triggerAlert(
        "Atenção",
        "Existem alterações não salvas. Deseja descartar?",
        () => {
          setAlertVisible(false);
          router.back();
        },
        "danger",
      );
    } else {
      router.back();
    }
  };

  if (fetching) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  const CustomPickerTrigger = ({
    label,
    value,
    field,
  }: {
    label: string;
    value: string;
    field: FormKeys;
  }) => (
    <View style={styles.flex1}>
      <Text style={[styles.label, { color: theme.accent }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.customInput,
          { backgroundColor: theme.primary, borderColor: theme.secondary },
        ]}
        onPress={() => openPicker(field)}
        activeOpacity={0.7}
      >
        <Text style={[styles.inputText, { color: theme.textLight }]}>
          {value}
        </Text>
        <Octicons name="chevron-down" size={16} color={theme.detail} />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.header, { color: theme.textLight }]}>
          Editar Tarefa
        </Text>

        <Text style={[styles.label, { color: theme.accent }]}>Título</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.primary,
              borderColor: theme.secondary,
              color: theme.textLight,
            },
          ]}
          value={form.titulo}
          onChangeText={(v) => updateForm("titulo", v)}
          placeholderTextColor={theme.detail}
        />

        <View style={styles.row}>
          <CustomPickerTrigger
            label="Status"
            value={form.status}
            field="status"
          />
          <View style={{ width: 12 }} />
          <CustomPickerTrigger
            label="Prioridade"
            value={form.prioridade}
            field="prioridade"
          />
        </View>

        <View style={styles.row}>
          <CustomPickerTrigger label="Tag" value={form.tag} field="tag" />
          <View style={{ width: 12 }} />
          <View style={styles.flex1}>
            <Text style={[styles.label, { color: theme.accent }]}>Prazo</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.primary,
                  borderColor: theme.secondary,
                  color: theme.textLight,
                },
              ]}
              value={form.deadline}
              placeholder="AAAA-MM-DD"
              placeholderTextColor={theme.detail}
              onChangeText={(v) => updateForm("deadline", v)}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.accent },
            !hasChanges && { backgroundColor: theme.secondary },
          ]}
          onPress={handleUpdate}
          disabled={loading || !hasChanges}
        >
          {loading ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <Text style={[styles.saveText, { color: theme.background }]}>
              Salvar Alterações
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={[styles.cancelButtonText, { color: "#FF3B30" }]}>
            Cancelar e Voltar
          </Text>
        </TouchableOpacity>

        <Modal visible={pickerVisible} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setPickerVisible(false)}
          >
            <View
              style={[styles.modalContent, { backgroundColor: theme.primary }]}
            >
              <Text style={[styles.modalHeader, { color: theme.textLight }]}>
                Selecione uma opção
              </Text>
              {activeField &&
                options[activeField].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.optionButton,
                      { borderBottomColor: theme.secondary },
                    ]}
                    onPress={() => selectOption(opt)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: theme.textLight },
                        form[activeField] === opt && {
                          color: theme.accent,
                          fontWeight: "bold",
                        },
                      ]}
                    >
                      {opt}
                    </Text>
                    {form[activeField] === opt && (
                      <Octicons name="check" size={16} color={theme.accent} />
                    )}
                  </TouchableOpacity>
                ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <CustomAlert
          visible={alertVisible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onConfirm={alertConfig.onConfirm}
          onCancel={() => setAlertVisible(false)}
          confirmText={alertConfig.type === "danger" ? "Descartar" : "Salvar"}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 24, maxWidth: 500, alignSelf: "center", width: "100%" },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  customInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: { fontSize: 16 },
  row: { flexDirection: "row" },
  flex1: { flex: 1 },
  saveButton: {
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { fontWeight: "600" },
  cancelButton: { marginTop: 15, padding: 15, alignItems: "center" },
  cancelButtonText: { fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    width: "100%",
    maxWidth: 350,
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: { fontSize: 16 },
});
