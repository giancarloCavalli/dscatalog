import PrivateRoute from "components/PrivateRoute";
import { Switch } from "react-router-dom";
import AdmNavbar from "./AdmNavbar";
import Users from "./Users";

import "./styles.css";
import Products from "./Products";

const Admin = () => {
  return (
    <div className="page-container d-xl-flex flex-xl-row">
      <AdmNavbar />      
      <div className="page-content">
        <Switch>
          <PrivateRoute path="/admin/products">
            <Products />
          </PrivateRoute>
          <PrivateRoute path="/admin/categories">
            <h2>Category CRUD</h2>
          </PrivateRoute>
          <PrivateRoute path="/admin/users" roles={["ROLE_ADMIN"]}>
            <Users />
          </PrivateRoute>
        </Switch>
      </div>
    </div>
  );
}

export default Admin;