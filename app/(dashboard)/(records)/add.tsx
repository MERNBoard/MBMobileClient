import React, { useState } from "react";
import { View, TextInput, StyleSheet, Pressable, Text } from "react-native";

import { Header, Body } from "@/components/Layout";
import { Title, Texto } from "@/components/Text";
import { ButtonColorido } from "@/components/Button"

export default function RecordAddPage() {
  const [status, setStatus] = useState("PENDENTE");
  const [prioridade, setPrioridade] = useState("MEDIA");

  return (
    <>
      <Header
        componente01={<Title texto="Nova Tarefa" />}
        componente02={null}
      />

      <Body
        componente01={
          <View>
            {/* Título */}
            <Texto texto="Título" />
            <TextInput
              style={styles.input}
              placeholder="Digite o título da tarefa"
            />

            {/* Descrição */}
            <Texto texto="Descrição" />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva a tarefa"
              multiline
            />

            {/* Tags */}
            <Texto texto="Tags" />
            <TextInput
              style={styles.input}
              placeholder="Ex: estudo, trabalho"
            />


            {/* Status */}
            <Texto texto="Status" />
            <View style={styles.row}>
              {["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA"].map(item => (
                <Pressable
                  key={item}
                  style={[
                    styles.option,
                    status === item && styles.optionSelected,
                  ]}
                  onPress={() => setStatus(item)}
                >
                  <Text style={styles.optionText}>
                    {item.replace("_", " ")}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Prioridade */}
            <Texto texto="Prioridade" />
            <View style={styles.row}>
              {["BAIXA", "MEDIA", "ALTA"].map(item => (
                <Pressable
                  key={item}
                  style={[
                    styles.option,
                    prioridade === item && styles.optionSelected,
                  ]}
                  onPress={() => setPrioridade(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              ))}
            </View>

            {/* Deadline */}
            <Texto texto="Deadline" />
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
            />

            {/* Botão */}
            <ButtonColorido
              text="Criar Tarefa"
              onPress={() => { }}
            />
          </View>
        }
        componente02={null}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  option: {
    backgroundColor: "#f2e7fe",
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },

  optionSelected: {
    backgroundColor: "#b39ddb",
  },

  optionText: {
    color: "#21155d",
    fontWeight: "bold",
  },
});
