import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
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

import api from "../../../services/api";

type FormKeys = "status" | "prioridade" | "tag" | "category";

export default function RecordAddPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    status: "PENDENTE",
    prioridade: "MEDIA",
    category: "Geral",
    tag: "Trabalho",
    deadline: "",
  });

  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeField, setActiveField] = useState<FormKeys | null>(null);

  const options = {
    status: ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"],
    prioridade: ["BAIXA", "MEDIA", "ALTA"],
    tag: ["Trabalho", "Estudo", "Pessoal", "Importante"],
    category: ["Design", "Dev", "Financeiro", "Geral"],
  };

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openPicker = (field: FormKeys) => {
    setActiveField(field);
    setPickerVisible(true);
  };

  const selectOption = (value: string) => {
    if (activeField) updateForm(activeField, value);
    setPickerVisible(false);
  };

  const handleSave = async () => {
    if (!form.titulo.trim()) {
      Alert.alert("Atenção", "Por favor, insira ao menos um título.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/usuario/tarefas", {
        titulo: form.titulo,
        descricao: form.descricao,
        status: form.status,
        prioridade: form.prioridade,
        categoria: form.category,
        tags: [form.tag],
        deadline: form.deadline || null,
      });

      Alert.alert("Sucesso", "Tarefa criada com sucesso!");
      router.replace("/(dashboard)/(records)");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível criar a tarefa.");
    } finally {
      setLoading(false);
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
        <Text style={styles.header}>Nova Tarefa</Text>

        <Text style={styles.label}>Título da Tarefa</Text>
        <TextInput
          style={styles.input}
          placeholder="O que precisa ser feito?"
          value={form.titulo}
          onChangeText={(v) => updateForm("titulo", v)}
        />

        <Text style={styles.label}>Descrição (Opcional)</Text>
        <TextInput
          style={[styles.input, { height: 80, textAlignVertical: "top" }]}
          placeholder="Detalhes sobre a tarefa..."
          multiline
          value={form.descricao}
          onChangeText={(v) => updateForm("descricao", v)}
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
            <Text style={styles.label}>Prazo</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-DD"
              value={form.deadline}
              onChangeText={(v) => updateForm("deadline", v)}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>Criar Tarefa</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        {/* Modal de Seleção */}
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
