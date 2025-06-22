import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import InputSelect from "./InputSelect";

export default function DateSelect({ modo, anoSelecionado, mesSelecionado, onAnoChange, onMesChange }) {

  const agora = new Date();
  const anoAtual = agora.getFullYear();
  const mesAtual = agora.getMonth() + 1;

  const anos = useMemo(
    () => Array.from({ length: 30 }, (_, i) => (anoAtual + i).toString()),
    [anoAtual]
  );

  const mesesTodos = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const mesesFiltrados = useMemo(() => {
    const anoNum = Number(anoSelecionado);

    if (isNaN(anoNum)) return [];

    if (modo === "cadastro") {
  
      if (anoNum > anoAtual) {
        return mesesTodos;
      } else if (anoNum === anoAtual) {
        return mesesTodos.filter((mes) => mes >= mesAtual);
      } else {

        return [];
      }
    }

    return mesesTodos;
  }, [modo, anoSelecionado, mesAtual, anoAtual, mesesTodos]);

  const opcoesAno = useMemo(
    () => anos.map((ano) => ({ label: ano, value: ano })),
    [anos]
  );

  const opcoesMes = useMemo(
    () =>
      mesesFiltrados.map((mes) => ({
        label: new Date(0, mes - 1).toLocaleString("pt-BR", { month: "long" }),
        value: mes.toString(),
      })),
    [mesesFiltrados]
  );

  useEffect(() => {
    const mesValido = mesesFiltrados.includes(Number(mesSelecionado));
    if (modo === "cadastro" && !mesValido && mesesFiltrados.length > 0) {
      onMesChange(mesesFiltrados[0]?.toString() || "");
    }
  }, [anoSelecionado, mesesFiltrados, mesSelecionado, modo, onMesChange]);

  useEffect(() => {
  }, [anoSelecionado, mesSelecionado, mesesFiltrados, agora, anoAtual, mesAtual, modo]);

  return (
    <View>
      <InputSelect
        label={`Ano para ${modo === "cadastro" ? "Cadastro" : "Busca"}:`}
        selectedValue={anoSelecionado}
        onValueChange={onAnoChange}
        options={opcoesAno}
      />
      <InputSelect
        label={`Mês para ${modo === "cadastro" ? "Cadastro" : "Busca"}:`}
        selectedValue={mesSelecionado}
        onValueChange={onMesChange}
        options={opcoesMes}
      />
    </View>
  );
}