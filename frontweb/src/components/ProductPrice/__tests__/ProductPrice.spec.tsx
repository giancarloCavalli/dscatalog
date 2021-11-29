import { render, screen } from "@testing-library/react";
import ProductPrice from '..';

describe('ProductPrice tests', () => {

  test('should render price starting with \'R$\' ', () => {
    const text = 'R$';

    render(
      <ProductPrice price={50} />
    )

    expect(screen.getByText(text)).toBeInTheDocument();
  })

  test('should render price with 2 decimals and comma separated', () => {
    const text = '50,00';

    render(
      <ProductPrice price={50} />
    )

    expect(screen.getByText(text)).toBeInTheDocument();
  })

});