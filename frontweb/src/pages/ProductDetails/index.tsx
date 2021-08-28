import { ReactComponent as ArrowIcon } from 'assets/images/arrow.svg';
import ProductPrice from 'components/ProductPrice';

import './styles.css';

const ProductDetails = () => {
  return (
    <div className="page-container">
      <div className="base-card page-card">
        <div className="goback-container d-flex align-items-center">
          <ArrowIcon />
          <h2>VOLTAR</h2>
        </div>
        <div className="row">
          <div className="col-xl-6">
            <div className="img-container">
              <img src="https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/1-big.jpg" alt="product name" />
            </div>  
            <div className="name-price-container">
              <h1>Nome do Produto</h1>
              <ProductPrice price={90.85} />
            </div>
          </div>
          <div className="col-xl-6">
            <div className="description-container">
              <h5>Descrição do produto</h5>
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Qui, ratione.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;