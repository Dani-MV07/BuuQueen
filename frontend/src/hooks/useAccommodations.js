import { useContext } from 'react';
import { AccommodationsContext } from '../context/AccommodationsContext';

export function useAccommodations() {
  const context = useContext(AccommodationsContext);
  if (!context) {
    throw new Error('useAccommodations debe usarse dentro de <AccommodationsProvider>.');
  }
  return context;
}
