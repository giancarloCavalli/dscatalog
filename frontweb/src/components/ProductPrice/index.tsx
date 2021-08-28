import { currencyBR } from 'util/formatters';
import './styles.css';

type Props = {
  price: number
}

const ProductPrice = ({ price }: Props) => {
  return (
    <div className="product-price-container">
      <span>R$</span>
      <h2 className="text-primary">{currencyBR(price)}</h2>
    </div>
  );
}

export default ProductPrice;