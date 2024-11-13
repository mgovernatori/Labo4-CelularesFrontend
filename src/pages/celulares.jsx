import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth";
import axios from "axios";
import "./Pages.css";

const { VITE_API_URL: apiUrl } = import.meta.env;

export default function Celulares() {
   const [celulares, setCelulares] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");
   const [editingCelular, setEditingCelular] = useState(null);
   const [showDetails, setShowDetails] = useState(null);
   const [detailsModalVisible, setDetailsModalVisible] = useState(false);
   const [editModalVisible, setEditModalVisible] = useState(false);
   const [celularDetalle, setCelularDetalle] = useState(null);

   const { user } = useAuthStore((state) => state);
   const isAdmin = user?.roles?.some((role) => role.nombre === "Administrador");

   const handleSearchChange = (event) => setSearchTerm(event.target.value);

   const fetchCelulares = async (marca = "") => {
      setLoading(true);
      try {
         const response = await axios.get(
            marca ? `${apiUrl}/celulares/marca/${marca}` : `${apiUrl}/celulares`
         );
         setCelulares(response.data);
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   const getCelularDetails = async (id) => {
      try {
         const response = await axios.get(`${apiUrl}/celulares/${id}`);
         return response.data;
      } catch (err) {
         console.error(
            "Error al obtener los detalles del celular:",
            err.message
         );
         return null;
      }
   };

   useEffect(() => {
      fetchCelulares();
   }, []);

   const handleSearchSubmit = (e) => {
      e.preventDefault();
      fetchCelulares(searchTerm);
   };

   const handleEditClick = async (celular) => {
      try {
         const response = await axios.get(`${apiUrl}/celulares/${celular.id}`);
         setEditingCelular(response.data);
         setEditModalVisible(true);
      } catch (err) {
         setError(err.message);
      }
   };

   const handleEditChange = (e) => {
      const {name, value } = e.target;
      if (name.startsWith("urlImagen-")) {
         const index = parseInt(name.split("-")[1], 10); 
         const updatedColores = editingCelular.colores.map((color, colorIndex) =>
            colorIndex === index ? { ...color, urlImagen: value } : color
         );
         setEditingCelular({
            ...editingCelular,
            colores: updatedColores,
         });
      } else {
         setEditingCelular({
            ...editingCelular,
            [name]: value,
         });
      }
   };

   const handleSaveChanges = async () => {
      try {
         await axios.put(
            `${apiUrl}/celulares/${editingCelular.id}`,
            editingCelular,
            {
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );
         fetchCelulares();
         setEditModalVisible(false);
         setEditingCelular(null);
      } catch (err) {
         setError(err.message);
      }
   };

   const toggleDetails = async (id) => {
      if (showDetails?.id === id) {
         setShowDetails(null);
         setDetailsModalVisible(false);
      } else {
         const celularDetalle = await getCelularDetails(id);
         setCelularDetalle(celularDetalle);
         setDetailsModalVisible(true);
      }
   };

   const closeDetailsModal = () => {
      setDetailsModalVisible(false);
      setCelularDetalle(null);
   };

   const closeEditModal = () => {
      setEditModalVisible(false);
      setEditingCelular(null);
   };

   const handleDelete = async (id) => {
      const confirmDelete = window.confirm(
         "¿Eliminar?"
      );
      if (confirmDelete) {
         try {
            await axios.delete(`${apiUrl}/celulares/${id}`);
            fetchCelulares();
         } catch (err) {
            setError(err.message);
         }
      }
   };

   return (
      <div className="style-celulares">
         <h1>CELULARES</h1>
         <button className="create">Crear Celular</button>
         <section className="search-phone">
            <form onSubmit={handleSearchSubmit}>
               <input
                  type="search"
                  id="search"
                  placeholder="Buscar celulares por marca"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  autoComplete="off"
               />
               <button type="submit">Buscar</button>
            </form>
         </section>

         <section className="results">
            {celulares.length > 0 ? (
               celulares.map((celular) => (
                  <div className="results-card" key={celular.id}>
                     <img src={celular.imagen} alt={celular.modelo} />
                     <h3>{celular.modelo}</h3>
                     <p>
                        <strong>Marca:</strong> {celular.marca.nombre}
                     </p>
                     <p>
                        <strong>Almacenamiento:</strong>{" "}
                        {celular.almacenamiento}
                     </p>
                     <p>
                        <strong>Precio:</strong> {celular.precio}
                     </p>

                     <button onClick={() => toggleDetails(celular.id)}>
                        {detailsModalVisible &&
                        celular.id === celularDetalle?.id
                           ? "Cerrar detalles"
                           : "Ver más detalles"}
                     </button>

                     {isAdmin && (
                        <>
                           <button onClick={() => handleEditClick(celular)}>
                              Actualizar
                           </button>
                           <button onClick={() => handleDelete(celular.id)}>
                              Eliminar
                           </button>
                        </>
                     )}
                  </div>
               ))
            ) : (
               <p>No se encontraron resultados.</p>
            )}
         </section>

         {detailsModalVisible && celularDetalle && (
            <div className="modal">
               <div className="modal-content">
                  <h2>{celularDetalle.modelo}</h2>
                  <p>
                     <strong>Marca:</strong> {celularDetalle.marca.nombre}
                  </p>
                  <p>
                     <strong>Almacenamiento:</strong>{" "}
                     {celularDetalle.almacenamiento}
                  </p>
                  <p>
                     <strong>Precio:</strong> {celularDetalle.precio}
                  </p>
                  <p>
                     <strong>Fecha de Lanzamiento:</strong>{" "}
                     {celularDetalle.fechaLanzamiento}
                  </p>
                  <p>
                     <strong>Sistema:</strong> {celularDetalle.sistema?.nombre}{" "}
                     v{celularDetalle.sistema?.version}
                  </p>
                  <p>
                     <strong>Procesador:</strong> {celularDetalle.procesador}
                  </p>
                  <p>
                     <strong>Pantalla:</strong> {celularDetalle.pantalla}
                  </p>
                  <p>
                     <strong>Cámara:</strong> {celularDetalle.camara}
                  </p>
                  <p>
                     <strong>RAM:</strong> {celularDetalle.ram}
                  </p>
                  <p>
                     <strong>Batería:</strong> {celularDetalle.bateria}
                  </p>
                  <p>
                     <strong>Colores:</strong>
                     <ul className="colors-list">
                        {(celularDetalle.colores || []).map((color, index) => (
                           <li key={index} className="colors-item">
                              <img
                                 src={color.urlImagen}
                                 alt={color.nombreColor}
                              />
                              <p>{color.nombreColor}</p>
                           </li>
                        ))}
                     </ul>
                  </p>

                  <button onClick={closeDetailsModal}>Cerrar</button>
               </div>
            </div>
         )}

         {editModalVisible && editingCelular && (
            <div className="modal">
               <div className="modal-content">
                  <h2>Editar Celular</h2>
                  {[
                     { label: "Modelo", name: "modelo" },
                     { label: "Almacenamiento", name: "almacenamiento" },
                     { label: "Precio", name: "precio" },
                     {
                        label: "Fecha de Lanzamiento",
                        name: "fechaLanzamiento",
                     },
                     { label: "Procesador", name: "procesador" },
                     { label: "Pantalla", name: "pantalla" },
                     { label: "Cámara", name: "camara" },
                     { label: "RAM", name: "ram" },
                     { label: "Batería", name: "bateria" },
                  ].map(({ label, name }) => (
                     <div key={name}>
                        <label>{label}:</label>
                        <input
                           name={name}
                           value={editingCelular[name]}
                           onChange={handleEditChange}
                        />
                     </div>
                  ))}
                  <div>
                     <label>Colores:</label>
                     <input
                        name="colores"
                        value={editingCelular.colores
                           .map((color) => color.nombreColor)
                           .join(", ")}
                        onChange={handleEditChange}
                     />
                  </div>
                  <div>
                     <label>URLs de Imágenes:</label>
                     {editingCelular.colores.map((color, index) => (
                        <div key={index}>
                           <input
                              name={`urlImagen-${index}`}
                              value={color.urlImagen}
                              onChange={handleEditChange}
                           />
                        </div>
                     ))}
                  </div>

                  <button onClick={handleSaveChanges}>Guardar Cambios</button>
                  <button onClick={closeEditModal}>Cancelar</button>
               </div>
            </div>
         )}
      </div>
   );
}
