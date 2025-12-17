import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../modals/Login";
import { useAuth } from "../../context/AuthContext";
import YapaLogo from "../../assets/logo.png";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isLogged, logout } = useAuth();
  const dropdownRef = useRef(null);

  const isHomepage = location.pathname === "/";

  const hideSearch =
    location.pathname.startsWith("/recetas/") ||
    location.pathname.startsWith("/mis-recetas") ||
    location.pathname.startsWith("/favoritos") ||
    location.pathname.startsWith("/refri") ||
    location.pathname.startsWith("/crear-receta");

  const showBack =
    location.pathname.startsWith("/recetas/") ||
    location.pathname.startsWith("/crear-receta") ||
    location.pathname.startsWith("/editar-receta") ||
    location.pathname.startsWith("/refri") ||
    location.pathname.startsWith("/mis-recetas") ||
    location.pathname.startsWith("/favoritos");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCrear = () => {
    if (isLogged) navigate("/crear-receta");
    else setShowLogin(true);
  };

  const handleLogin = () => setShowLogin(true);

  const handleBack = () => {
    // Verificar si hay cambios no guardados
    if (window.checkUnsavedChanges) {
      const canNavigate = window.checkUnsavedChanges(() => navigate('/recetas'));
      if (canNavigate) {
        navigate('/recetas');
      }
    } else {
      navigate('/recetas');
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);

    // Si está en crear-receta, redirigir al homepage
    if (location.pathname.startsWith('/crear-receta') || location.pathname.startsWith('/editar-receta')) {
      navigate('/');
    }
  };

  const handleNavigate = (path) => {
    // Verificar si hay cambios no guardados
    if (window.checkUnsavedChanges) {
      const canNavigate = window.checkUnsavedChanges(() => navigate(path));
      if (canNavigate) {
        navigate(path);
      }
    } else {
      navigate(path);
    }
    setShowDropdown(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/recetas?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="flex items-center justify-between min-h-18 px-10 bg-white w-full mx-auto mb-3">
      <div className="flex items-center space-x-3">
        {!isHomepage && (
          <img
            src={YapaLogo}
            alt="Logo Yapa"
            className="h-12 w-auto cursor-pointer"
            onClick={() => navigate('/')}
          />
        )}

        {showBack && (
          <button
            onClick={handleBack}
            className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-full"
            style={{
              backgroundColor: "#EDEDED",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#D5D5D5"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#EDEDED"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {!isHomepage && !hideSearch && (
          <div className="flex items-center space-x-2">
            <div className="relative flex items-center border border-gray-400 rounded-lg overflow-hidden w-64">
              <svg className="w-5 h-5 text-gray-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Palabra Buscada"
                className="py-1 pl-2 pr-4 w-full focus:outline-none text-gray-700 placeholder-gray-500 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <button
              className="px-6 py-1.5 text-white font-semibold rounded-lg shadow-md hover:brightness-110 cursor-pointer"
              style={{ backgroundColor: '#F99F3F' }}
              onClick={handleSearch}
            >
              Buscar
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4 ">
        {isLogged && user ? (
          <div className="relative pt-1.5" ref={dropdownRef}>
            <button onClick={() => setShowDropdown(!showDropdown)} className="focus:outline-none cursor-pointer">
              <img
                src={
                  user.picture ||
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.name || user.email}&background=F99F3F&color=fff`
                }
                alt={user.name || "Usuario"}
                className="w-11.5 h-11.5 rounded-full border-2 border-gray-200 cursor-pointer hover:border-orange-300 transition"
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-4 px-2 z-50 border border-gray-100">
                <div className="flex items-center space-x-3 px-4 pb-4 border-b border-gray-200">
                  <img
                    src={
                      user.picture ||
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${user.name || user.email}&background=F99F3F&color=fff`
                    }
                    alt={user.name || "Usuario"}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-gray-800">
                      {user.name || user.email || "Usuario"}
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => handleNavigate('/mis-recetas')}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition rounded-lg cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-gray-700 text-sm">Mis recetas</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('/favoritos')}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition rounded-lg cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="text-gray-700 text-sm">Mis Favoritos</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('/refri')}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition rounded-lg cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-gray-700 text-sm">Mi Refri</span>
                  </button>
                </div>

                <div className="border-t border-gray-200 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition rounded-lg cursor-pointer"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-gray-700 text-sm">Salir</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="px-4 py-1.5 font-semibold border rounded-lg shadow-sm cursor-pointer transition duration-150"
            style={{ color: '#F99F3F', borderColor: '#F99F3F' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ff9a2e15'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={handleLogin}
          >
            Iniciar Sesión
          </button>
        )}

        {location.pathname !== "/crear-receta" && (
          <button
            className="flex items-center px-4 py-1.5 text-white font-semibold rounded-lg shadow-md hover:brightness-110 cursor-pointer"
            style={{ backgroundColor: '#F99F3F' }}
            onClick={handleCrear}
          >
            <span className="text-xl mr-1">+</span>
            Crear una Receta
          </button>
        )}
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default Navbar;
