import ProductPrice from 'components/ProductPrice';
import { Product } from 'types/product';

import './styles.css';

type Props = {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <div className="base-card product-card">
      <div className="card-top-container">
        <img src={product.imgUrl} alt={product.name} />
      </div>
      <div className="card-bottom-container">
        <h5>{product.name}</h5>
        <ProductPrice price={product.price} />
      </div>
    </div>
  );
}

export default ProductCard;