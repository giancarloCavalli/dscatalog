import AdmNavbar from "./AdmNavbar";

import "./styles.css";

const Admin = () => {
  return (
    <div className="page-container d-xl-flex flex-xl-row">
      <AdmNavbar />      
      <div className="page-content">
        <h2>conteudo</h2>
      </div>
    </div>
  );
}

export default Admin;