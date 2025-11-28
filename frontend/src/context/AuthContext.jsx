import { createContext, useContext, useState, useEffect } from "react";

// Crear contexto
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Estado de autenticación
  const [user, setUser] = useState(null); // info del usuario
  const [token, setToken] = useState(null); // token JWT del backend
  const [isLogged, setIsLogged] = useState(false);

  // Inicializar desde localStorage si ya hay datos guardados
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsLogged(true);
    }
  }, []);

  // Función de login
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsLogged(true);

    // Guardar en localStorage para persistencia
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLogged(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  return useContext(AuthContext);
}
