import Pagination from 'components/Pagination';
import ProductCard from 'components/ProductCard';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Product } from 'types/product';
import { SpringPage } from 'types/vendor/spring';
import { requestBackend } from 'util/requests';
import { AxiosRequestConfig } from 'axios';

import './styles.css';
import CardLoader from './CardLoader';

const Catalog = () => {
  const [page, setPage] = useState<SpringPage<Product>>();
  const [isLoading, setIsLoading] = useState(false);

  const [isGetProductsSubscribed, setIsGetProductsSubscribed] = useState(false);

  const getProducts = useCallback((pageNumber: number) => {
    setIsGetProductsSubscribed(true);

    const params: AxiosRequestConfig = {
      method: 'GET',
      url: '/products',
      params: {
        page: pageNumber,
        size: 12,
      },
    };

    setIsLoading(true);
    requestBackend(params)
      .then((response) => {
        if (isGetProductsSubscribed)
         setPage(response.data);
      })
      .finally(() => {
        if (isGetProductsSubscribed)
          setIsLoading(false);
      });
  }, [isGetProductsSubscribed]);

  useEffect(() => {
    getProducts(0);

    return () => {setIsGetProductsSubscribed(false)};
  }, [getProducts]);

  return (
    <div className="container my-4">
      <div className="row page-title">
        <h4>Catálogo de Produtos</h4>
      </div>
      <div className="row">
        {isLoading ? (
          <CardLoader />
        ) : (
          page?.content.map((product) => (
            <div className="col-sm-6 col-lg-4 col-xl-3" key={product.id}>
              <Link to={`/products/${product.id}`}>
                <ProductCard product={product} />
              </Link>
            </div>
          ))
        )}
      </div>
      <div className="row">
        <Pagination pageCount={page ? page.totalPages : 0} range={2}
          onChange={getProducts}
        />
      </div>
    </div>
  );
};

export default Catalog;
