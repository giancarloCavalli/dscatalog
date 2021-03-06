import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
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
    let isApiSubscribed = true;

    requestBackend({ url: '/categories' })
      .then((response) => {
        if (isApiSubscribed) {
          const page = response.data as SpringPage<Category>;
          setSelectCategories(page.content);
        }
      })
      .catch((error) => {
        console.log(error);
      });

      return () => {isApiSubscribed = false};
      
  }, []);

  useEffect(() => {
    let isApiSubscribed = true;

    if (isEditing) {
      requestBackend({ url: `/products/${productId}` })
        .then((response) => {
          if (isApiSubscribed) {
            const product = response.data as Product;
  
            setValue('name', product.name);
            setValue('price', product.price);
            setValue('description', product.description);
            setValue('imgUrl', product.imgUrl);
            setValue('categories', product.categories);
          }
        })
        .catch(error => {

        });
    }

    return () => {isApiSubscribed = false};

  }, [isEditing, productId, setValue]);

  const onSubmit = (formData: Product) => {

    const data = { ...formData, price: String(formData.price).replace(',', '.') };

    const config: AxiosRequestConfig = {
      method: isEditing ? 'PUT' : 'POST',
      url: isEditing ? `/products/${productId}` : '/products',
      data,
      withCredentials: true,
    };

    requestBackend(config)
      .then(() => {
        toast.info("Produto cadastrado com sucesso");
        history.push('/admin/products');
      })
      .catch((error) => {
        toast.error("Erro ao cadastrar produto");
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

      <form onSubmit={handleSubmit(onSubmit)} data-testid="form">
        <div className="row product-crud-form-inputs-container">
          <div className="col-lg-6">
            <div className="product-crud-form-input">
              <input
                {...register('name', {
                  required: 'Campo obrigat??rio',
                })}
                type="text"
                className={`form-control base-input ${errors.name ? 'is-invalid' : ''
                  }`}
                placeholder="Nome do produto"
                name="name"
                data-testid="name"
              />
              <div className="invalid-feedback d-block">
                {errors.name?.message}
              </div>
            </div>

            <div className="product-crud-form-input">
              <label htmlFor="categories" className="d-none" >Categorias</label>
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
                    placeholder="Categoria"
                    getOptionLabel={(category: Category) => category.name}
                    getOptionValue={(category: Category) => String(category.id)}
                    inputId="categories"
                  />
                )}
              />
              {errors.categories && (
                <div className="invalid-feedback d-block">
                  Campo obrigat??rio
                </div>
              )}
            </div>

            <div className="product-crud-form-input">
              <Controller
                name="price"
                rules={{ required: 'Campo obrigat??rio' }}
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    placeholder="Pre??o"
                    className={`form-control base-input ${errors.name ? 'is-invalid' : ''
                      }`}
                    disableGroupSeparators={true} //disabled because otherwise it will mistake thousand format with decimal format
                    value={field.value}
                    onValueChange={field.onChange}
                    data-testid="price"
                  />
                )}
              />
              <div className="invalid-feedback d-block">
                {errors.price?.message}
              </div>
            </div>

            <div className="product-crud-form-input">
              <input
                {...register('imgUrl', {
                  required: 'Campo obrigat??rio',
                  pattern: {
                    value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                    message: 'Deve ser uma URL v??lida',
                  },
                })}
                type="text"
                className={`form-control base-input ${errors.name ? 'is-invalid' : ''
                  }`}
                placeholder="URL da imagem do produto"
                name="imgUrl"
                data-testid="imgUrl"
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
                required: 'Campo obrigat??rio',
              })}
              className={`form-control base-input h-auto ${errors.name ? 'is-invalid' : ''
                }`}
              placeholder="Descri????o"
              name="description"
              data-testid="description"
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
          <button className="btn btn-primary product-crud-btn" >SALVAR</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
