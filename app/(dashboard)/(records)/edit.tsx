import { Octicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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

// Importando o componente de alerta
import CustomAlert from "../../../components/CustomAlert";

// Definindo os tipos para as opções
type FormKeys = "status" | "priority" | "tag" | "category";

export default function RecordEditPage() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Estados para o formulário
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pendente",
    priority: "Média",
    category: "Geral",
    tag: "Trabalho",
    deadline: "",
  });

  // --- ESTADO DO ALERTA CUSTOMIZADO ---
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
    status: ["Pendente", "Em Andamento", "Concluída", "Cancelada"],
    priority: ["Baixa", "Média", "Alta", "Urgente"],
    tag: ["Trabalho", "Estudo", "Pessoal", "Importante"],
    category: ["Design", "Dev", "Financeiro", "Geral"],
  };

  useEffect(() => {
    if (id) {
      setForm({
        title: "Revisão de Projeto",
        description: "Ajustar os pontos críticos do layout",
        status: "Em Andamento",
        priority: "Alta",
        category: "Design",
        tag: "Urgente",
        deadline: "20/05/2024",
      });
    }
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
      () => {
        setAlertVisible(false);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setHasChanges(false);
          router.back();
        }, 1000);
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
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.customInput}
        onPress={() => openPicker(field)}
        activeOpacity={0.7}
      >
        <Text style={styles.inputText}>{value}</Text>
        <Octicons name="chevron-down" size={16} color="#AAA" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.header}>Editar Tarefa</Text>

        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          value={form.title}
          onChangeText={(v) => updateForm("title", v)}
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
            value={form.priority}
            field="priority"
          />
        </View>

        <View style={styles.row}>
          <CustomPickerTrigger label="Tag" value={form.tag} field="tag" />
          <View style={{ width: 12 }} />
          <View style={styles.flex1}>
            <Text style={styles.label}>Prazo</Text>
            <TextInput
              style={styles.input}
              value={form.deadline}
              placeholder="DD/MM/AAAA"
              onChangeText={(v) => updateForm("deadline", v)}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !hasChanges && styles.disabledButton]}
          onPress={handleUpdate}
          disabled={loading || !hasChanges}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancelar e Voltar</Text>
        </TouchableOpacity>

        <Modal visible={pickerVisible} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setPickerVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Selecione uma opção</Text>
              {activeField &&
                options[activeField].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.optionButton}
                    onPress={() => selectOption(opt)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        form[activeField] === opt && styles.optionSelected,
                      ]}
                    >
                      {opt}
                    </Text>
                    {form[activeField] === opt && (
                      <Octicons name="check" size={16} color="#000" />
                    )}
                  </TouchableOpacity>
                ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* --- COMPONENTE DE ALERTA RENDERIZADO AQUI --- */}
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
  container: { flex: 1, backgroundColor: "#fff" },
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
    color: "#AAA",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  input: {
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    marginBottom: 20,
  },
  customInput: {
    borderWidth: 1,
    borderColor: "#EFEFEF",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#F9F9F9",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: { fontSize: 16, color: "#333" },
  row: { flexDirection: "row" },
  flex1: { flex: 1 },
  saveButton: {
    backgroundColor: "#000",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: { backgroundColor: "#EEE" },
  saveText: { color: "#fff", fontWeight: "600" },
  cancelButton: { marginTop: 15, padding: 15, alignItems: "center" },
  cancelButtonText: { color: "#FF3B30", fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
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
    borderBottomColor: "#F5F5F5",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionText: { fontSize: 16, color: "#666" },
  optionSelected: { color: "#000", fontWeight: "bold" },
});
