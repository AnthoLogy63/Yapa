import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../modals/Login";

function Navbar({ isLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const isHomepage = location.pathname === "/";
  const showBack =
    location.pathname.startsWith("/recetas/") ||
    location.pathname.startsWith("/crear-receta") ||
    location.pathname.startsWith("/editar-receta") ||
    location.pathname.startsWith("/refri");

  const handleCrear = () => {
    if (isLoggedIn) navigate("/crear-receta");
    else setShowLogin(true);
  };

  const handleLogin = () => setShowLogin(true);
  const handleBack = () => navigate(-1);

  return (
    <div className={`flex items-center min-h-20 px-10 bg-white shadow-md w-full mx-auto mb-5 ${isHomepage ? "justify-end" : "justify-between"}`}>

      {showBack && (
        <button className="text-2xl cursor-pointer mr-4" onClick={handleBack}>←</button>
      )}

      {!isHomepage ? (
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center border border-gray-400 rounded-lg overflow-hidden w-64">
            <svg className="w-5 h-5 text-gray-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Palabra Buscada" className="py-2 pl-2 pr-4 w-full focus:outline-none text-gray-700 placeholder-gray-500 bg-white" />
          </div>

          <button className="px-6 py-2 text-white font-semibold rounded-lg shadow-md hover:brightness-110" style={{ backgroundColor: '#F99F3F' }}>
            Buscar
          </button>
        </div>
      ) : (
        <div className="w-64"></div>
      )}

      <div className="flex items-center space-x-4">
        {!isLoggedIn && (
          <button
            className="px-4 py-2 font-semibold border rounded-lg shadow-sm"
            style={{ color: '#F99F3F', borderColor: '#F99F3F' }}
            onClick={handleLogin}
          >
            Iniciar Sesión
          </button>
        )}

        <button
          className="flex items-center px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:brightness-110"
          style={{ backgroundColor: '#F99F3F' }}
          onClick={handleCrear}
        >
          <span className="text-xl mr-1">+</span>
          Crear una Receta
        </button>
      </div>

      {/* Modal Login */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default Navbar;
