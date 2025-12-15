import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Home/Homepage";
import Recetas from "../pages/Recetas/Recetas";
import RecetasDetail from "../pages/Recetas/RecetasDetail";
import CrearRecetaPage from "../pages/CrearReceta/CrearRecetaPage";
import Login from "../components/modals/Login";
import Refri from "../pages/Refri/Refri";
import MisRecetasPage from "../pages/MisRecetas/MisRecetasPage";
import FavoritosPage from "../pages/Favoritos/FavoritosPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/recetas" element={<Recetas />} />
      <Route path="/recetas/:id" element={<RecetasDetail />} />
      <Route path="/crear-receta" element={<CrearRecetaPage />} />
      <Route path="/editar-receta/:id" element={<CrearRecetaPage />} />
      <Route path="/mis-recetas" element={<MisRecetasPage />} />
      <Route path="/favoritos" element={<FavoritosPage />} />
      <Route path="/refri" element={<Refri />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRouter;