import './styles.css';

const AdmNavbar = () => {
  return (
    <nav className="adm-nav-container">
      <ul>
        <li>
          <a href="link" className="adm-nav-item active">
            <p>Produtos</p>
          </a>
        </li>
        <li>
          <a href="http://" className="adm-nav-item">
            <p>Categorias</p>
          </a>
        </li>
        <li>
          <a href="http://" className="adm-nav-item">
            <p>Usuários</p>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default AdmNavbar;
