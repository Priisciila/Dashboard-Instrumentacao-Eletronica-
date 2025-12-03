// Função auxiliar para formatar qualquer valor numérico para 2 casas decimais
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0.00';
  const n = parseFloat(num);
  // Se não for um número válido, retorna 0.00, senão formata
  return isNaN(n) ? '0.00' : n.toFixed(2);
};