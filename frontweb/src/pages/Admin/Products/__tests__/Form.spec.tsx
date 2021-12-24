import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router, useParams } from 'react-router-dom';
import history from 'util/history';
import Form from '../Form';
import { server } from './helpers/fixtures';
import selectEvent from 'react-select-event';

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

  test("Form should render product form", () => {

    render(
      <Router history={history}>
        <Form />
      </Router>
    )

    expect(screen.getByText("Dados do produto")).toBeInTheDocument();
  });

  test("Form show toast and redirect to Product List when subscribed", async () => {

    render(
      <Router history={history}>
        <Form />
      </Router>
    )

    const nameInput = screen.getByTestId("name");
    const priceInput = screen.getByTestId("price");
    const imgUrlInput = screen.getByTestId("imgUrl");
    const descriptionInput = screen.getByTestId("description");
    const categoriesInput = screen.getByLabelText("Categorias");

    userEvent.type(nameInput, "Mouse Razer");
    userEvent.type(priceInput, "277.90");
    userEvent.type(imgUrlInput, "https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/1-big.jpg");
    userEvent.type(descriptionInput, "Mouse braaabo");

    await selectEvent.select(categoriesInput, ["Eletrônicos", "Computadores"]);
  });
});