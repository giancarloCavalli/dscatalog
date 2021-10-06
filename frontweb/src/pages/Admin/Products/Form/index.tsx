import './styles.css';

const Form = () => {
  return (
    <div className="base-card product-crud-form-card-container">
      <div className="product-crud-form-title">
        <h3>Dados do produto</h3>
      </div>

      <form action="">
        <div className="row product-crud-form-inputs-container">
          <div className="col-lg-6">
            <div className="product-crud-form-input">
              <input type="text" className="form-control base-input" />
            </div>
            <div className="product-crud-form-input">
              <input type="text" className="form-control base-input" />
            </div>
            <div className="product-crud-form-input product-crud-form-input-last-item">
              <input type="text" className="form-control base-input" />
            </div>
          </div>
          <div className="col-lg-6">
            <textarea
              name=""
              rows={10}
              className="form-control base-input h-auto"
            ></textarea>
          </div>
        </div>

        <div className="product-crud-form-buttons-container">
          <button className="btn btn-outline-danger product-crud-btn">CANCELAR</button>
          <button className="btn btn-primary product-crud-btn">SALVAR</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
