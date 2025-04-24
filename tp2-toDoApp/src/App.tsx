import { useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes.tsx';
import { useSprints } from './hooks/useSprints.tsx';
import { useTareas } from './hooks/useTareas.tsx';

const App: React.FC = () => {
  const { getTareas } = useTareas();
  const { getSprints } = useSprints();
  
  useEffect(() => {
    console.log("Cargando datos iniciales...");
    getTareas();
    getSprints();
  }, []);
  return (
    <AppRoutes/>
  );
};


export default App;