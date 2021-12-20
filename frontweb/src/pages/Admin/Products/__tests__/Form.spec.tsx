import { render, screen, waitFor } from '@testing-library/react';
import { Router, useParams } from 'react-router-dom';
import history from 'util/history';
import Form from '../Form';

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

  test("Form should render product form", async () => {
    
    render(
      <Router history={history}>
        <Form />
      </Router>
    )

    await waitFor(() => {
      expect(screen.getByText("Dados do produto")).toBeInTheDocument();
    })
  });
});