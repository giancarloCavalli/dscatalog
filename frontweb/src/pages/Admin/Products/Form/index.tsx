import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import Select from 'react-select';
import { Category } from 'types/category';
import { Product } from 'types/product';
import { SpringPage } from 'types/vendor/spring';
import { requestBackend } from 'util/requests';
import './styles.css';

type UrlParams = {
  productId: string;
};

const Form = () => {
  const [selectCategories, setSelectCategories] = useState<Category[]>([]);

  const { productId } = useParams<UrlParams>();

  const isEditing = productId !== 'create';

  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<Product>();

  useEffect(() => {
    requestBackend({ url: '/categories' })
      .then((response) => {
        const page = response.data as SpringPage<Category>;
        setSelectCategories(page.content);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (isEditing) {
      requestBackend({ url: `/products/${productId}` }).then((response) => {
        const product = response.data as Product;

        setValue('name', product.name);
        setValue('price', product.price);
        setValue('description', product.description);
        setValue('imgUrl', product.imgUrl);
        setValue('categories', product.categories);
      });
    }
  }, [isEditing, productId, setValue]);

  const onSubmit = (formData: Product) => {
    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `/products/${productId}` : '/products',
      data: formData,
      withCredentials: true,
    };

    requestBackend(config)
      .then((response) => {
        console.log(response.data);
        history.push('/admin/products');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    history.push('/admin/products');
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
              <Controller
                name="categories"
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={selectCategories}
                    classNamePrefix="product-crud-form-select"
                    isMulti
                    getOptionLabel={(category: Category) => category.name}
                    getOptionValue={(category: Category) => String(category.id)}
                  />
                )}
              />
              {errors.categories && (
                <div className="invalid-feedback d-block">
                  Campo obrigatório
                </div>
              )}
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

            <div className="product-crud-form-input">
              <input
                {...register('imgUrl', {
                  required: 'Campo obrigatório',
                  pattern: {
                    value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                    message: 'Deve ser uma URL válida',
                  },
                })}
                type="text"
                className={`form-control base-input ${
                  errors.name ? 'is-invalid' : ''
                }`}
                placeholder="URL da imagem do produto"
                name="imgUrl"
              />
              <div className="invalid-feedback d-block">
                {errors.imgUrl?.message}
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
