import { render, screen, waitFor } from '@testing-library/react';
import Catalog from '..';
import { Router } from 'react-router-dom';
import history from 'util/history';
import { server } from './helpers/fixtures';

//TODO fix cleanup function need warning
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers()); // Garantee that all the resources will be reseted after each test runs, so the next won't be influenced by the prior
afterAll(() => server.close());

describe("Catalog tests", () => {

  test("should render Catalog with title equal to \'Catálogo de Produtos\' ", () => {
    render(
      <Router history={history}>
        <Catalog />
      </Router>
    )

    expect(screen.getByText("Catálogo de Produtos")).toBeInTheDocument();
  });

  test("should render Catalog with products", async () => {

    render(
      <Router history={history}>
        <Catalog />
      </Router>
    )

    await waitFor(() => {
      expect(screen.getByText("Smart TV")).toBeInTheDocument();
    });
  });

});