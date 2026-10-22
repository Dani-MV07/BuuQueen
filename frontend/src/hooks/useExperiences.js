import { useContext } from 'react';
import { ExperiencesContext } from '../context/ExperiencesContext';

export function useExperiences() {
  const context = useContext(ExperiencesContext);
  if (!context) {
    throw new Error('useExperiences debe usarse dentro de <ExperiencesProvider>.');
  }
  return context;
}
