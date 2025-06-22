import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import InputSelect from "./InputSelect";

export default function DateSelect({
  modo,
  anoSelecionado,
  mesSelecionado,
  onAnoChange,
  onMesChange,
}) {
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;

  const anos = useMemo(
    () => Array.from({ length: 30 }, (_, i) => (anoAtual + i).toString()),
    [anoAtual]
  );

  const mesesTodos = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const mesesFiltrados = useMemo(() => {
    const anoNum = parseInt(anoSelecionado);
    return modo === "cadastro"
      ? mesesTodos.filter((mes) => anoNum > anoAtual || mes >= mesAtual)
      : mesesTodos;
  }, [modo, anoSelecionado, mesAtual, anoAtual]);

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
    if (modo === "cadastro" && mesSelecionado && !mesValido) {
      onMesChange("");
    }
  }, [anoSelecionado, mesesFiltrados]);

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
