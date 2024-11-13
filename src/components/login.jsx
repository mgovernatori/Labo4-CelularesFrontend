import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { login } from "../services/auth";
import { useAuthStore } from "../store/auth";
import { useLocation } from "wouter";
import "./login.css";

export default function Login() {
   const [user, setUser] = useState({
      username: "",
      contraseña: "",
   });

   const [loginError, setLoginError] = useState("");

   const { handleLogin } = useAuthStore((data) => data);
   const [, setLocation] = useLocation(); 


   const handleChange = (e) => {
      const { value, name } = e.target;
      setUser((prevUser) => ({ ...prevUser, [name]: value }));
   };

   const loginMutation = useMutation({
      mutationKey: ["login"],
      mutationFn: login,
      onSuccess: (data) => {
         if (data && data.user) {
            handleLogin(data); 
            setLocation("/inicio"); 
         }
      },
      onError: (error) => {
         console.error("Error en login:", error);
         setLoginError("Acceso incorrecto.");
      },
   });

   // Maneja el envío del formulario
   const handleSubmit = (e) => {
      e.preventDefault();
      setLoginError("");
      loginMutation.mutate(user); 
   };

   return (
      <div className="container-form">
         <h1>CELULARES LIBRES</h1>
         {loginError && <div className="error-tab">{loginError}</div>}
         <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-user">
               <input
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  autoComplete="username"
                  placeholder="Nombre de usuario"
               />
            </label>
            <label className="login-user">
               <input
                  type="password"
                  name="contraseña"
                  value={user.contraseña}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Contraseña"
               />
            </label>
            <div className="buttons-users">
               <button type="submit" className="button-login">
                  Iniciar sesión
               </button>
            </div>
         </form>
      </div>
   );
}
