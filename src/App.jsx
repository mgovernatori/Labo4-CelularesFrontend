import { Route, Router, Switch } from "wouter";
import "./App.css";
import axios from "axios";
import Login from "./components/login";
import Inicio from "./components/inicio";
import Celulares from "./pages/celulares";

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = 'Bearer ${token}';
  }
  return config;
}, error => {
  return Promise.reject(error);
});

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Login}/>
        <Route path="/inicio" component={Inicio} />
        <Route path="/celulares" component={Celulares} />
      </Switch>
    </Router>
  );
}

export default App;