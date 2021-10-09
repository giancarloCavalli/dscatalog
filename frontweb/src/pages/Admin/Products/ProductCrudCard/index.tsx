import ProductPrice from 'components/ProductPrice';
import { AxiosRequestConfig } from 'axios';
import { useHistory } from 'react-router-dom';
import { Product } from 'types/product';
import CategoryBadge from '../CategoryBadge';

import './styles.css';
import { requestBackend } from 'util/requests';

type Props = {
  product: Product;
  onDelete: Function
};

const ProductCrudCard = ({ product, onDelete }: Props) => {
  const history = useHistory();

  const handleEditar = () => {
    history.push(`/admin/products/${product.id}`);
  };
  
  const handleDelete = (productId: number) => {
    if (!window.confirm("Tem certeza que deseja deletar o produto?"))
      return;

    const config: AxiosRequestConfig = {
      method: 'DELETE',
      url: `/products/${productId}`,
      withCredentials: true,
    };

    requestBackend(config)
      .then(response => {
        onDelete();
      })
      .catch(error => {
        console.log(error);
      })
  };

  return (
    <div className="base-card product-crud-card">
      <div className="product-crud-card-top-container">
        <img src={product.imgUrl} alt={product.name} />
      </div>
      <div className="product-crud-card-description">
        <div className="product-crud-card-bottom-container">
          <h5>{product.name}</h5>
          <ProductPrice price={product.price} />
        </div>
        <div className="product-crud-categories-container">
          {product.categories.map((category) => (
            <CategoryBadge name={category.name} key={category.id} />
          ))}
        </div>
      </div>
      <div className="product-crud-card-buttons-container">
        <button
          className="btn btn-outline-danger product-crud-card-button"
          onClick={() => handleDelete(product.id)}
        >
          EXCLUIR
        </button>
        <button
          className="btn btn-outline-secondary product-crud-card-button"
          onClick={handleEditar}
        >
          EDITAR
        </button>
      </div>
    </div>
  );
};

export default ProductCrudCard;
