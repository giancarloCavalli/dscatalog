import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { BASE_URL } from 'util/requests';

const findCategoriesResponse = {
  "content": [
      {
          "id": 1,
          "name": "Livros"
      },
      {
          "id": 2,
          "name": "Eletrônicos"
      },
      {
          "id": 3,
          "name": "Computadores"
      }
  ],
  "pageable": {
      "sort": {
          "sorted": false,
          "unsorted": true,
          "empty": true
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 20,
      "paged": true,
      "unpaged": false
  },
  "last": true,
  "totalPages": 1,
  "totalElements": 3,
  "size": 20,
  "number": 0,
  "sort": {
      "sorted": false,
      "unsorted": true,
      "empty": true
  },
  "first": true,
  "numberOfElements": 3,
  "empty": false
}

export const server = setupServer(
  rest.get(`${BASE_URL}/categories`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(findCategoriesResponse)
    );
  })
);