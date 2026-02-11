import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
} from "react-native";

import { Header, Body } from "@/components/Layout";
import OptionSelector from "@/components/OptionSelector";
import { Title, Texto } from "@/components/Text";
import { ButtonColorido } from "@/components/Button";

/**
 * Página para adicionar nova tarefa/registro
 * Funcionalidades:
 * - Formulário completo com validação de estado
 * - Campos de texto livre (título, descrição, categoria, tags, data)
 * - Selectors para Status e Prioridade (usando OptionSelector)
 * - Layout com Header e Body personalizados
 * - Estado centralizado no objeto 'form'
 */
export default function RecordAddPage() {
  /**
   * Estado do formulário - objeto com todos os campos da tarefa
   * Valores iniciais: campos vazios + status/prioridade padrão
   */
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    tags: "",
    status: "Pendente",      // Valor padrão
    prioridade: "Média",     // Valor padrão
    deadline: "",
  });

  /**
   * Função utilitária para atualizar campos do formulário
   * @param campo - Nome do campo a ser atualizado (chave do objeto form)
   * @param valor - Novo valor do campo
   * Usa spread operator para manter outros campos intactos
   */
  const updateForm = (campo: string, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  return (
    <>
      {/* Header da página com título "Nova Tarefa" */}
      <Header
        componente01={<Title texto="Nova Tarefa" />}
        componente02={null}  // Slot direito vazio
      />

      {/* Body principal com formulário completo */}
      <Body
        componente01={
          <View>
            {/* Campo TÍTULO */}
            <Texto texto="Título" />
            <TextInput
              style={styles.input}
              placeholder="Digite um título"
              value={form.titulo}
              onChangeText={(v) => updateForm("titulo", v)}
            />

            {/* Campo DESCRIÇÃO */}
            <Texto texto="Descrição" />
            <TextInput
              style={styles.input}
              placeholder="Descreva a tarefa"
              value={form.descricao}
              onChangeText={(v) => updateForm("descricao", v)}
            />

            {/* Campo CATEGORIA */}
            <Texto texto="Categoria" />
            <TextInput
              style={styles.input}
              placeholder="Ex: Estudos, Trabalho"
              value={form.categoria}
              onChangeText={(v) => updateForm("categoria", v)}
            />

            {/* Campo TAGS */}
            <Texto texto="Tags" />
            <TextInput
              style={styles.input}
              placeholder="Ex: node.js, JavaScript"
              value={form.tags}
              onChangeText={(v) => updateForm("tags", v)}
            />

            {/* SELECTOR STATUS - usando componente OptionSelector */}
            <OptionSelector
              label="Status"
              options={["Pendente", "Em Andamento", "Concluída"]}
              selected={form.status}
              onSelect={(valor) => updateForm("status", valor)}
            />

            {/* SELECTOR PRIORIDADE - usando componente OptionSelector */}
            <OptionSelector
              label="Prioridade"
              options={["Baixa", "Média", "Alta"]}
              selected={form.prioridade}
              onSelect={(valor) => updateForm("prioridade", valor)}
            />

            {/* Campo DATA/DEADLINE */}
            <Texto texto="Data" />
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={form.deadline}
              onChangeText={(v) => updateForm("deadline", v)}
            />

            {/* Botão de ação principal */}
            <ButtonColorido
              text="Criar Tarefa"
              onPress={() => console.log(form)} 
            />
          </View>
        }
        componente02={null}  // Slot direito vazio
      />
    </>
  );
}


const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15, // Espaçamento entre campos
  },
});
