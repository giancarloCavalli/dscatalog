import PrivateRoute from "components/PrivateRoute";
import { Switch } from "react-router-dom";
import AdmNavbar from "./AdmNavbar";

import "./styles.css";
import Users from "./User";

const Admin = () => {
  return (
    <div className="page-container d-xl-flex flex-xl-row">
      <AdmNavbar />      
      <div className="page-content">
        <Switch>
          <PrivateRoute path="/admin/products">
            <h2>Product CRUD</h2>
          </PrivateRoute>
          <PrivateRoute path="/admin/categories">
            <h2>Category CRUD</h2>
          </PrivateRoute>
          <PrivateRoute path="/admin/users">
            <Users />
          </PrivateRoute>
        </Switch>
      </div>
    </div>
  );
}

export default Admin;