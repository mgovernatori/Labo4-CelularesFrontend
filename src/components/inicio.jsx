import { Link } from "wouter";
import { useAuthStore } from "../store/auth";
import { useLocation } from "wouter";
import "./inicio.css";

export default function Inicio() {
   const [, setLocation] = useLocation(); 
   const user = useAuthStore((state) => state.user);
   const roles = user?.roles ?? [];

   const isUser = roles.some(role => role.nombre === "Usuario");
   const isAdmin = roles.some(role => role.nombre === "Administrador");

   const { handleLogout } = useAuthStore((state) => state);

   const logout = () => {
      handleLogout();
      setLocation("/");
   };

   return (
      <div className="inicio-container">
         <h1 className="inicio-title">Bienvenido/a {user?.nombre}</h1>
         <ul className="link-user">
            {(isUser || isAdmin) && (
               <li className="link-item">
                  <Link to="/celulares" className="link">Ir a Celulares →</Link>
               </li>
            )}
         </ul>
         <button className="button-logout" onClick={logout}>Cerrar Sesión</button>
      </div>
   );
}