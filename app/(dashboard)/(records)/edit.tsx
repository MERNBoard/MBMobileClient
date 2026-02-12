import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Body } from "@/components/Layout";
import OptionSelector from "@/components/OptionSelector";
import { Texto, Title } from "@/components/Text";

import CustomAlert from "../../../components/CustomAlert";
import { useTheme } from "../../../context/ThemeContext";
import api from "../../../services/api";

export default function RecordEditPage() {
  const { theme, themeName } = useTheme();
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

  const formatIsoToBr = (isoDate: string) => {
    if (!isoDate) return "";
    const date = isoDate.split("T")[0];
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;

    setForm((prev) => ({ ...prev, deadline: formatted }));
    setHasChanges(true);
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
            deadline: task.deadline ? formatIsoToBr(task.deadline) : "",
          });
        }
      } catch (error) {
        triggerAlert(
          "Erro",
          "Não foi possível carregar a tarefa.",
          () => setAlertVisible(false),
          "danger",
        );
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

  const handleUpdate = async () => {
    // Validar formato da data antes de enviar
    const dateParts = form.deadline.split("/");
    if (dateParts.length !== 3 || dateParts[2].length !== 4) {
      triggerAlert(
        "Data Inválida",
        "Use o formato DD/MM/AAAA",
        () => setAlertVisible(false),
        "danger",
      );
      return;
    }

    // Converter DD/MM/AAAA -> ISO 8601
    const isoDeadline = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T23:59:59.000Z`;

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
            deadline: isoDeadline,
          });
          setHasChanges(false);
          router.back();
        } catch (error) {
          triggerAlert(
            "Erro",
            "Falha ao atualizar.",
            () => setAlertVisible(false),
            "danger",
          );
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

  const inputBg = theme.input || (themeName === "dark" ? "#252525" : "#E8E8E8");
  const contrastBorder = theme.detail || "#333";
  const textColor = theme.textLight || "#FFFFFF";
  const accentColor = theme.accent || "#60439f";
  const labelColor =
    themeName === "esmeralda" ? theme.textPendente : accentColor;

  if (fetching) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Body
        componente01={
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.formWrapper}>
              <View style={{ marginBottom: 25 }}>
                <Title texto="Editar Tarefa" style={{ color: labelColor }} />
              </View>

              <Texto
                texto="Título"
                style={{ color: labelColor, fontWeight: "bold" }}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBg,
                    color: textColor,
                    borderColor: contrastBorder,
                  },
                ]}
                value={form.titulo}
                onChangeText={(v) => updateForm("titulo", v)}
              />

              <Texto
                texto="Descrição"
                style={{ color: labelColor, fontWeight: "bold" }}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBg,
                    color: textColor,
                    borderColor: contrastBorder,
                    height: 100,
                    textAlignVertical: "top",
                  },
                ]}
                multiline
                value={form.descricao}
                onChangeText={(v) => updateForm("descricao", v)}
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Texto
                    texto="Categoria"
                    style={{ color: labelColor, fontWeight: "bold" }}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBg,
                        color: textColor,
                        borderColor: contrastBorder,
                      },
                    ]}
                    value={form.category}
                    onChangeText={(v) => updateForm("category", v)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Texto
                    texto="Data Limite"
                    style={{ color: labelColor, fontWeight: "bold" }}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBg,
                        color: textColor,
                        borderColor: contrastBorder,
                      },
                    ]}
                    value={form.deadline}
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    maxLength={10}
                    onChangeText={handleDateChange}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <OptionSelector
                    label="Status"
                    options={["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"]}
                    selected={form.status}
                    onSelect={(v) => updateForm("status", v)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <OptionSelector
                    label="Prioridade"
                    options={["BAIXA", "MEDIA", "ALTA"]}
                    selected={form.prioridade}
                    onSelect={(v) => updateForm("prioridade", v)}
                  />
                </View>
              </View>

              <View style={[styles.row, { marginTop: 25, gap: 10 }]}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={[styles.actionBtn, styles.cancelBtn]}
                >
                  <Text style={styles.cancelText}>CANCELAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleUpdate}
                  disabled={loading || !hasChanges}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: hasChanges ? accentColor : "#444",
                      flex: 2,
                    },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.saveText}>SALVAR ALTERAÇÕES</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        }
        componente02={null}
      />

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={alertConfig.onConfirm}
        onCancel={() => setAlertVisible(false)}
        confirmText={alertConfig.type === "danger" ? "Descartar" : "Salvar"}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContainer: { paddingBottom: 40, alignItems: "center" },
  formWrapper: {
    width: "100%",
    maxWidth: 600,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  input: { borderRadius: 12, padding: 15, marginBottom: 20, borderWidth: 1.2 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  actionBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderColor: "#FF4444" },
  cancelText: { color: "#FF4444", fontWeight: "bold" },
  saveText: { color: "#FFF", fontWeight: "bold" },
});
