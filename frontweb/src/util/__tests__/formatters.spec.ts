import { currencyBR } from "util/formatters";

test('currencyBR should format number pt-BR when given 10.1', () => {
  const result = currencyBR(10.1);
  expect(result).toEqual('10,10');
});