import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';
import ProductPrice from 'components/ProductPrice';
import { Link } from 'react-router-dom';

import './styles.css';

const ProductDetails = () => {
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
                src="https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/1-big.jpg"
                alt="product name"
              />
            </div>
            <div className="name-price-container d-lg-flex flex-xl-column">
              <h1 className="col-lg-9">Nome do Produto</h1>
              <span className="col-lg-6">
                <ProductPrice price={90.85} />
              </span>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="description-container gray-border">
              <h6>Descrição do produto</h6>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui,
                ratione.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
