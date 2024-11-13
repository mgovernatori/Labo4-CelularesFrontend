import axios from "axios";

const { VITE_API_URL: apiUrl } = import.meta.env;

export const login = async (user) => {
   try {
      const { data } = await axios.post(`${apiUrl}/auth/login`, user);

      if (data.token && data.user) {
         localStorage.setItem('authToken', data.token);
         return {
            user: data.user,
            token: data.token,
         };
      } else {
         throw new Error("Respuesta inesperada del servidor: falta 'user' o 'token'");
      }
   } catch (error) {
      console.error("Error al hacer login:", error);
      throw error;
   }
};
