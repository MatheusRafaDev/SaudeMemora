const formatarData = (dataString) => {
  try {
    const [ano, mes, dia] = dataString.split("-").map(Number);
    // eslint-disable-next-line no-unused-vars
    const data = new Date(ano, mes - 1, dia);

    const diaStr = dia.toString().padStart(2, "0");
    const meses = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ];
    const mesStr = meses[mes - 1];
    return `${diaStr} ${mesStr} ${ano}`;
  } catch {
    return "Data inválida";
  }
};

export default formatarData;
