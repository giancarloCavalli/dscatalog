import { currencyBR } from "util/formatters";

describe('format price for positive numbers', () => {

  test('currencyBR should format number pt-BR when given 10.1', () => {
    const result = currencyBR(10.1);
    expect(result).toEqual('10,10');
  });

  test('currencyBR should format number pt-BR when given 0.1', () => {
    const result = currencyBR(0.1);
    expect(result).toEqual('0,10');
  });

});

describe('format price for non positive numbers', () => {

  test('currencyBR should format number pt-BR when given 0', () => {
    const result = currencyBR(0);
    expect(result).toEqual('0,00');
  });

  test('currencyBR should format number pt-BR when given -5.1', () => {
    const result = currencyBR(-5.1);
    expect(result).toEqual('-5,10');
  });

});