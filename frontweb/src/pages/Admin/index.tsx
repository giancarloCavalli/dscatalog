import { Switch, Route } from "react-router-dom";
import AdmNavbar from "./AdmNavbar";

import "./styles.css";

const Admin = () => {
  return (
    <div className="page-container d-xl-flex flex-xl-row">
      <AdmNavbar />      
      <div className="page-content">
        <Switch>
          <Route path="/admin/products">
            <h2>Product CRUD</h2>
          </Route>
          <Route path="/admin/categories">
            <h2>Category CRUD</h2>
          </Route>
          <Route path="/admin/users">
            <h2>User CRUD</h2>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Admin;