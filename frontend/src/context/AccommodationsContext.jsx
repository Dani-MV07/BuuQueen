import { createContext, useCallback, useEffect, useState } from 'react';
import accommodationService from '../services/accommodationService';

export const AccommodationsContext = createContext(null);

export function AccommodationsProvider({ children }) {
  const [accommodations, setAccommodations] = useState([]);
  const [deletedAccommodations, setDeletedAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');

  const loadAccommodations = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) setLoading(true);
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

    if (showLoading) setLoading(false);
  }, []);

  useEffect(() => {
    loadAccommodations();
  }, [loadAccommodations]);

  const value = {
    accommodations,
    deletedAccommodations,
    loading,
    error,
    deletedError,
    loadAccommodations
  };

  return (
    <AccommodationsContext.Provider value={value}>
      {children}
    </AccommodationsContext.Provider>
  );
}
