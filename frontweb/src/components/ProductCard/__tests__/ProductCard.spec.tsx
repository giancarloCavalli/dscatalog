import { render, screen } from "@testing-library/react";
import { Product } from "types/product";
import ProductCard from "..";

describe('ProductCard tests', () => {

  const product: Product = {
    "id": 1,
    "name": "The Lord of the Rings",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "price": 90.5,
    "imgUrl": "https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/1-big.jpg",
    "date": "2020-07-13T20:50:07.123450Z",
    "categories": [
        {
            "id": 1,
            "name": "Livros"
        }
    ]
}
  
  test('should render product name', () => {

    render(
      <ProductCard product={product} />
    );
    
    expect(screen.getByText(product.name)).toBeInTheDocument;
  });
  
  test('should render product image', () => {
    
    render(
      <ProductCard product={product} />
    );
    
    expect(screen.getByAltText(product.name)).toBeInTheDocument;
  });
  
  test('should render product price starting with \"R$\"', () => {
    const text = "R$";

    render(
      <ProductCard product={product} />
    );

    expect(screen.getByText(text)).toBeInTheDocument;
  });

  test('should render product price with 2 decimal and comma separated', () => {
    const text: string = Number(product.price).toFixed(2).replace('.', ',');

    render(
      <ProductCard product={product} />
    )

    expect(screen.getByText(text)).toBeInTheDocument;
  });
});