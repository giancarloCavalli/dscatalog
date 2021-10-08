import { AxiosRequestConfig } from 'axios';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Product } from 'types/product';
import { requestBackend } from 'util/requests';
import './styles.css';

const Form = () => {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Product>();

  const onSubmit = (formData: Product) => {

    const data = { ...formData,
      imgUrl:'https://raw.githubusercontent.com/devsuperior/dscatalog-resources/master/backend/img/25-big.jpg', 
      categories: [ {id:1, name:""}]};

    const config: AxiosRequestConfig = {
      method: 'POST',
      url: '/products',
      data,
      withCredentials: true,
    };

    requestBackend(config)
      .then((response) => {
        console.log(response.data);
        history.push("/admin/products");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    history.push("/admin/products");
  };

  return (
    <div className="base-card product-crud-form-card-container">
      <div className="product-crud-form-title">
        <h3>Dados do produto</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row product-crud-form-inputs-container">
          <div className="col-lg-6">
            <div className="product-crud-form-input">
              <input
                {...register('name', {
                  required: 'Campo obrigatório',
                })}
                type="text"
                className={`form-control base-input ${
                  errors.name ? 'is-invalid' : ''
                }`}
                placeholder="Nome do produto"
                name="name"
              />
              <div className="invalid-feedback d-block">
                {errors.name?.message}
              </div>
            </div>
            <div className="product-crud-form-input">
              <input
                {...register('price', {
                  required: 'Campo obrigatório',
                })}
                type="text"
                className={`form-control base-input ${
                  errors.name ? 'is-invalid' : ''
                }`}
                placeholder="Preço"
                name="price"
              />
              <div className="invalid-feedback d-block">
                {errors.price?.message}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <textarea
              rows={10}
              {...register('description', {
                required: 'Campo obrigatório',
              })}
              className={`form-control base-input h-auto ${
                errors.name ? 'is-invalid' : ''
              }`}
              placeholder="Descrição"
              name="description"
            ></textarea>
            <div className="invalid-feedback d-block">
              {errors.description?.message}
            </div>
          </div>
        </div>

        <div className="product-crud-form-buttons-container">
          <button
            className="btn btn-outline-danger product-crud-btn"
            onClick={handleCancel}
          >
            CANCELAR
          </button>
          <button className="btn btn-primary product-crud-btn">SALVAR</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
