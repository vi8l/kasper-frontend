import "antd/dist/antd.min.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import TableViewComponent from "./components/Table/table-view.component";

const App = () => {
  return (
    <div className="App">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          Home
        </Link>
      </nav>
      <TableViewComponent />
    </div>
  );
};
export default App;
