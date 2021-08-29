import { NavLink } from 'react-router-dom';
import './styles.css';

const AdmNavbar = () => {
  return (
    <nav className="adm-nav-container">
      <ul>
        <li>
          <NavLink to="/admin/products" className="adm-nav-item">
            <p>Produtos</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/categories" className="adm-nav-item">
            <p>Categorias</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" className="adm-nav-item">
            <p>Usuários</p>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdmNavbar;
