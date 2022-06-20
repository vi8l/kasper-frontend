import "antd/dist/antd.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import TableView from "./components/Table/table-view";

const App = () => {
  return (
    <div className="App">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Home
        </Link>
      </nav>
      <TableView />
    </div>
  );
};
export default App;
