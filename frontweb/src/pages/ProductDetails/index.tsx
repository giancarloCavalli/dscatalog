import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';
import axios from 'axios';
import ProductPrice from 'components/ProductPrice';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from 'types/product';
import { BASE_URL } from 'util/requests';

import './styles.css';

const ProductDetails = () => {
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    axios.get(`${BASE_URL}/products/3`).then((response) => {
      setProduct(response.data);
    });
  }, []);

  return (
    <div className="page-container">
      <div className="base-card page-card">
        <Link to="/products">
          <div className="goback-container d-flex align-items-center">
            <ArrowIcon />
            <h2>VOLTAR</h2>
          </div>
        </Link>
        <div className="row">
          <div className="col-xl-6">
            <div className="img-container gray-border">
              <img
                src={product?.imgUrl}
                alt={product?.name}
              />
            </div>
            <div className="name-price-container d-lg-flex flex-xl-column">
              <h1 className="col-lg-9">{product?.name}</h1>
              <span className="col-lg-6">
                {product && <ProductPrice price={product?.price} />}
              </span>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="description-container gray-border">
              <h6>Descrição do produto</h6>
              <p>
                {product?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
