import { AxiosRequestConfig } from 'axios';
import Pagination from 'components/Pagination';
import ProductCrudCard from 'pages/Admin/Products/ProductCrudCard';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from 'types/product';
import { SpringPage } from 'types/vendor/spring';
import { requestBackend } from 'util/requests';

import './styles.css';

type ControlComponentsData = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Product>>();

  const [controlComponentsData, setControlComponentsData] =
    useState<ControlComponentsData>({ activePage: 0 });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({activePage: pageNumber});
  }

  useEffect(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/products',
      params: {
        page: controlComponentsData.activePage,
        size: 4,
      },
    };
  
    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentsData]);

  return (
    <div className="product-crud-card-container">
      <div className="product-crud-bar-container">
        <Link to="/admin/products/create">
          <button className="btn btn-primary btn-crud-add">ADICIONAR</button>
        </Link>
        <div className="base-card product-filter-container">Search bar</div>
      </div>

      <div className="row">
        {page?.content.map((product) => (
          <div className="col-sm-6 col-md-12" key={product.id}>
            <ProductCrudCard
              product={product}
              onDelete={() => {}}
            />
          </div>
        ))}
      </div>
      <Pagination
        pageCount={page ? page.totalPages : 0}
        range={2}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default List;
