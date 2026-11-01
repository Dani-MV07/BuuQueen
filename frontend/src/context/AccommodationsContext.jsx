import { createContext, useCallback, useEffect, useState } from 'react';
import accommodationService from '../services/accommodationService';

export const AccommodationsContext = createContext(null);

export function AccommodationsProvider({ children }) {
  const [accommodations, setAccommodations] = useState([]);
  const [deletedAccommodations, setDeletedAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');

  const loadAccommodations = useCallback(async () => {
    setLoading(true);
    setError('');
    setDeletedError('');
    const [activeResult, deletedResult] = await Promise.allSettled([
      accommodationService.list(),
      accommodationService.listDeleted()
    ]);

    if (activeResult.status === 'fulfilled') {
      setAccommodations(activeResult.value);
    } else {
      setError(activeResult.reason.message);
    }

    if (deletedResult.status === 'fulfilled') {
      setDeletedAccommodations(deletedResult.value);
    } else {
      setDeletedError(deletedResult.reason.message);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadAccommodations();
  }, [loadAccommodations]);

  //Todas las funciones de abajo la tienen que hacer los hooks, no el context. Hay que modificarlo
  const createAccommodation = useCallback(async (data) => {
    const created = await accommodationService.create(data);
    setAccommodations((current) => [...current, created]);
    return created;
  }, []);

  const updateAccommodation = useCallback(async (id, data) => {
    const updated = await accommodationService.update(id, data);
    setAccommodations((current) => current.map((item) => (
      item._id === id ? updated : item
    )));
    return updated;
  }, []);

  const setAccommodationActive = useCallback(async (id, isActive) => {
    const updated = await accommodationService.setActive(id, isActive);
    setAccommodations((current) => current.map((item) => (
      item._id === id ? updated : item
    )));
    return updated;
  }, []);

  const setAccommodationStatus = useCallback(async (id, status) => {
    const updated = await accommodationService.setStatus(id, status);
    setAccommodations((current) => current.map((item) => (
      item._id === id ? updated : item
    )));
    return updated;
  }, []);

  const removeAccommodation = useCallback(async (id) => {
    const deletedAccommodation = accommodations.find((item) => item._id === id);
    await accommodationService.remove(id);
    setAccommodations((current) => current.filter((item) => item._id !== id));
    if (deletedAccommodation) {
      setDeletedAccommodations((deletedCurrent) => [
        { ...deletedAccommodation, deletedAt: new Date().toISOString() },
        ...deletedCurrent.filter((item) => item._id !== id)
      ]);
    }
  }, [accommodations]);

  const restoreAccommodation = useCallback(async (id) => {
    const restored = await accommodationService.restore(id);
    setDeletedAccommodations((current) => current.filter((item) => item._id !== id));
    setAccommodations((current) => [restored, ...current.filter((item) => item._id !== id)]);
    return restored;
  }, []);

  const value = {
    accommodations,
    deletedAccommodations,
    loading,
    error,
    deletedError,
    loadAccommodations,
    createAccommodation,
    updateAccommodation,
    setAccommodationActive,
    setAccommodationStatus,
    removeAccommodation,
    restoreAccommodation
  };

  return (
    <AccommodationsContext.Provider value={value}>
      {children}
    </AccommodationsContext.Provider>
  );
}
