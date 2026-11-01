import { useCallback, useContext } from 'react';
import { AccommodationsContext } from '../context/AccommodationsContext';
import accommodationService from '../services/accommodationService';

export function useAccommodations() {
  const context = useContext(AccommodationsContext);
  if (!context) {
    throw new Error('useAccommodations debe usarse dentro de <AccommodationsProvider>.');
  }

  const { loadAccommodations } = context;

  const createAccommodation = useCallback(async (data) => {
    const created = await accommodationService.create(data);
    await loadAccommodations({ showLoading: false });
    return created;
  }, [loadAccommodations]);

  const updateAccommodation = useCallback(async (id, data) => {
    const updated = await accommodationService.update(id, data);
    await loadAccommodations({ showLoading: false });
    return updated;
  }, [loadAccommodations]);

  const setAccommodationActive = useCallback(async (id, isActive) => {
    const updated = await accommodationService.setActive(id, isActive);
    await loadAccommodations({ showLoading: false });
    return updated;
  }, [loadAccommodations]);

  const setAccommodationStatus = useCallback(async (id, status) => {
    const updated = await accommodationService.setStatus(id, status);
    await loadAccommodations({ showLoading: false });
    return updated;
  }, [loadAccommodations]);

  const removeAccommodation = useCallback(async (id) => {
    await accommodationService.remove(id);
    await loadAccommodations({ showLoading: false });
  }, [loadAccommodations]);

  const restoreAccommodation = useCallback(async (id) => {
    const restored = await accommodationService.restore(id);
    await loadAccommodations({ showLoading: false });
    return restored;
  }, [loadAccommodations]);

  return {
    ...context,
    createAccommodation,
    updateAccommodation,
    setAccommodationActive,
    setAccommodationStatus,
    removeAccommodation,
    restoreAccommodation
  };
}
