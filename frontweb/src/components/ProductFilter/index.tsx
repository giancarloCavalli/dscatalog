import { ReactComponent as SearchIcon } from 'assets/images/search-icon.svg';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { Category } from 'types/category';
import { SpringPage } from 'types/vendor/spring';
import { requestBackend } from 'util/requests';
import './styles.css';

type ProductFilterData = {
  name: string;
  category: Category;
};

const ProductFilter = () => {

  const [selectCategories, setSelectCategories] = useState<Category[]>([]);

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

  const {
    register,
    handleSubmit,
    control
  } = useForm<ProductFilterData>();

  const onSubmit = (formData: ProductFilterData) => {
    console.log('ENVIOU',formData);
  };

  return (
    <div className="base-card product-filter-container">
      <form onSubmit={handleSubmit(onSubmit)} className="product-filter-form">
        <div className="product-filter-name-container">
          <input
            {...register('name')}
            type="text"
            className="form-control"
            placeholder="Nome do produto"
            name="name"
          />
          <button>
            <SearchIcon />
          </button>
        </div>
        <div className="product-filter-bottom-container">
          <div className="product-filter-category-container">
          <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={selectCategories}
                    isClearable
                    isSearchable
                    classNamePrefix="product-crud-form-select"
                    getOptionLabel={(category: Category) => category.name}
                    getOptionValue={(category: Category) => String(category.id)}
                  />
                )}
              />
          </div>
          <button className="btn btn-outline-secondary">LIMPAR FILTRO</button>
        </div>
      </form>
    </div>
  );
};

export default ProductFilter;
