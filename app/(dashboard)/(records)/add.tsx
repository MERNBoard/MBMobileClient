import { router } from "expo-router";
import React, { useState } from "react";
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

/**
 * Página de Criação de Registros/Tarefas.
 * * Fornece um formulário completo para criar uma nova tarefa, incluindo
 * tratamento de datas, seleção de prioridade/status e validação de rascunho antes de sair.
 */
export default function RecordAddPage() {
  const { theme, themeName } = useTheme();
  const [loading, setLoading] = useState(false);

  // --- CONFIGURAÇÃO DE ALERTAS ---
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "default" as "default" | "danger",
    onConfirm: () => setAlertVisible(false),
    confirmText: "Ok",
  });

  /**
   * Helper para exibir o CustomAlert com configurações dinâmicas.
   */
  const showAlert = (
    title: string,
    message: string,
    type: "default" | "danger" = "default",
    action?: () => void,
    confirmText: string = "Ok",
  ) => {
    setAlertConfig({
      title,
      message,
      type,
      onConfirm: action ? action : () => setAlertVisible(false),
      confirmText,
    });
    setAlertVisible(true);
  };

  // --- ESTADO DO FORMULÁRIO ---
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    categoria: "Geral",
    tags: "",
    status: "PENDENTE",
    prioridade: "MEDIA",
    deadline: "",
  });

  /**
   * Aplica máscara de data (DD/MM/AAAA) enquanto o usuário digita.
   * @param text - String bruta do input.
   */
  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, ""); // Remove não numéricos
    let formatted = cleaned;
    if (cleaned.length > 2)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4)
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    updateForm("deadline", formatted);
  };

  /**
   * Atualiza um campo específico do objeto de estado do formulário.
   */
  const updateForm = (campo: string, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  /**
   * Lógica de cancelamento.
   * Se houver dados preenchidos, pergunta ao usuário se ele deseja descartar as alterações.
   */
  const handleCancel = () => {
    const hasData =
      form.titulo.trim() !== "" ||
      form.descricao.trim() !== "" ||
      form.deadline.trim() !== "" ||
      form.tags.trim() !== "" ||
      form.categoria !== "Geral";

    if (hasData) {
      showAlert(
        "Descartar?",
        "Deseja realmente cancelar?",
        "danger",
        () => {
          setAlertVisible(false);
          router.back();
        },
        "Sim, cancelar",
      );
    } else {
      router.back();
    }
  };

  /**
   * Valida e envia os dados para a API.
   * * Converte a data de formato BR (DD/MM/AAAA) para ISO (YYYY-MM-DD...) antes do envio.
   */
  const handleSave = async () => {
    // Validações de campos obrigatórios
    if (
      !form.titulo.trim() ||
      !form.descricao.trim() ||
      !form.deadline.trim()
    ) {
      showAlert("Atenção", "Preencha Título, Descrição e Data.", "danger");
      return;
    }

    // Validação de estrutura da data
    const dateParts = form.deadline.split("/");
    if (dateParts.length !== 3 || dateParts[2].length !== 4) {
      showAlert("Data Inválida", "Use o formato DD/MM/AAAA", "danger");
      return;
    }

    // Construção da data ISO para o backend
    const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T23:59:59.000Z`;

    setLoading(true);
    try {
      await api.post("/usuario/tarefas", {
        titulo: form.titulo,
        descricao: form.descricao,
        status: form.status,
        prioridade: form.prioridade,
        categoria: form.categoria,
        tags: form.tags ? [form.tags] : ["Geral"],
        deadline: isoDate,
      });

      showAlert("Sucesso", "Tarefa criada!", "default", () => {
        setAlertVisible(false);
        router.replace("/(dashboard)/(records)");
      });
    } catch (error: any) {
      const msg =
        error.response?.data?.error || "Erro ao conectar com o servidor.";
      showAlert("Erro", msg, "danger");
    } finally {
      setLoading(false);
    }
  };

  // --- DESIGN SYSTEM & THEMING ---
  const inputBg = theme.input || (themeName === "dark" ? "#252525" : "#E8E8E8");
  const contrastBorder = theme.detail || "#333";
  const textColor = theme.textLight || "#FFFFFF";
  const accentColor = theme.accent || "#60439f";
  const labelColor =
    themeName === "esmeralda" ? theme.textPendente : accentColor;

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
                <Title texto="Nova Tarefa" style={{ color: labelColor }} />
              </View>

              {/* Seção: Identificação */}
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
                placeholder="Nome da tarefa"
                placeholderTextColor="#666"
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
                    height: 80,
                    textAlignVertical: "top",
                  },
                ]}
                placeholder="Detalhes..."
                placeholderTextColor="#666"
                multiline
                value={form.descricao}
                onChangeText={(v) => updateForm("descricao", v)}
              />

              {/* Seção: Classificação e Prazo */}
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
                    placeholder="Geral"
                    placeholderTextColor="#666"
                    value={form.categoria}
                    onChangeText={(v) => updateForm("categoria", v)}
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
                    placeholder="DD/MM/AAAA"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    maxLength={10}
                    value={form.deadline}
                    onChangeText={handleDateChange}
                  />
                </View>
              </View>

              <Texto
                texto="Tag"
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
                placeholder="Ex: Trabalho"
                placeholderTextColor="#666"
                value={form.tags}
                onChangeText={(v) => updateForm("tags", v)}
              />

              {/* Seção: Seletores de Opções (Enums) */}
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

              {/* Botões de Ação */}
              <View style={[styles.row, { marginTop: 25, gap: 10 }]}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={[styles.actionBtn, styles.cancelBtn]}
                >
                  <Text style={styles.cancelText}>CANCELAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={loading}
                  style={[
                    styles.actionBtn,
                    { backgroundColor: accentColor, flex: 2 },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.saveText}>CRIAR TAREFA</Text>
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
        confirmText={alertConfig.confirmText}
        cancelText="Voltar"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
  cancelText: { color: "#FF4444", fontWeight: "bold", fontSize: 14 },
  saveText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
});
