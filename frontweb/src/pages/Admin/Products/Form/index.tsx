import './styles.css';

const Form = () => {
  return (
    <div className="base-card product-crud-form-card-container">
      <div>
        <h3>Dados do produto</h3>
      </div>

      <form action="">
        <div className="row">
          <div className="col-lg-6">
            <input type="text" className="form-control base-input" />
            <input type="text" className="form-control base-input" />
            <input type="text" className="form-control base-input" />
          </div>
          <div className="col-lg-6">
            <textarea name="" rows={10} className="form-control base-input"></textarea>
          </div>
        </div>

        <div>
          <button className="btn btn-outline-danger">CANCELAR</button>
          <button className="btn btn-primary">SALVAR</button>
        </div>
      </form>
    </div>
  );
};

export default Form;
