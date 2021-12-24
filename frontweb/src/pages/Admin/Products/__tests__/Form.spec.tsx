import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router, useParams } from 'react-router-dom';
import history from 'util/history';
import Form from '../Form';
import { server } from './helpers/fixtures';
import selectEvent from 'react-select-event';
import { ToastContainer } from 'react-toastify';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

describe("Product form create tests", () => {

  beforeEach(() => {
    (useParams as jest.Mock).mockReturnValue({
      productId: 'create'
    })
  });

  test("should render product form", () => {

    render(
      <Router history={history}>
        <Form />
      </Router>
    )

    expect(screen.getByText("Dados do produto")).toBeInTheDocument();
  });

  test("should show toast and redirect to Product List when subscribed", async () => {

    render(
      <Router history={history}>
        <ToastContainer />
        <Form />
      </Router>
    )
    
    const nameInput = screen.getByTestId("name");
    const priceInput = screen.getByTestId("price");
    const imgUrlInput = screen.getByTestId("imgUrl");
    const descriptionInput = screen.getByTestId("description");
    const categoriesInput = screen.getByLabelText("Categorias");
    
    const submitButton = screen.getByRole('button', { name: /salvar/i }); // Best actual practice to get a button in a form
    
    await selectEvent.select(categoriesInput, ["Eletrônicos", "Computadores"]);
    userEvent.type(nameInput, "Mouse Razer");
    userEvent.type(priceInput, "277,90");
    userEvent.type(imgUrlInput, "https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/1-big.jpg");
    userEvent.type(descriptionInput, "Mouse braaabo");

    userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Produto cadastrado com sucesso")).toBeInTheDocument();
    });

    expect(history.location.pathname).toEqual('/admin/products');
    
  });

  test("should show 5 validation messagens when just clicking submit", async () => {

    render(
      <Router history={history}>
        <Form />
      </Router>
    )

    const submitButton = screen.getByRole('button', { name: /salvar/i });

    userEvent.click(submitButton);

    await waitFor(() => {
      const messages = screen.getAllByText("Campo obrigatório");
      expect(messages).toHaveLength(5);
    })
    
  });
});