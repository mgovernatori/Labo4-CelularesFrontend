import { Route, Router, Switch } from "wouter";
import "./App.css";
import axios from "axios";
import Login from "./components/login";
import Inicio from "./components/inicio";
import Celulares from "./pages/celulares";
import Usuarios from "./pages/usuarios";
import { useAuthStore } from "./store/auth";

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
  const user = useAuthStore((data) => data.user);
  return (
    <Router>
      <Switch>
        <Route path="/" component={Login}/>
        <Route path="/inicio" component={Inicio} />
        <Route path="/celulares" component={Celulares} />
        {user?.roles.includes("ADMIN") && <Route exact-path="/usuarios" component={Usuarios} />}
      </Switch>
    </Router>
  );
}

export default App;