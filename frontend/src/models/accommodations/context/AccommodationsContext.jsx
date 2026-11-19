import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import accommodationService from '../services/accommodationService';

export const AccommodationsContext = createContext(null);

export function AccommodationsProvider({ children }) {
  const { isAdmin } = useAuth();
  const [accommodations, setAccommodations] = useState([]);
  const [deletedAccommodations, setDeletedAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');
  const requestIdRef = useRef(0);

  const loadAccommodations = useCallback(async ({ showLoading = true } = {}) => {
    const requestId = ++requestIdRef.current;
    if (showLoading) setLoading(true);
    setError('');
    setDeletedError('');
    const [activeResult, deletedResult] = await Promise.allSettled([
      accommodationService.list(),
      accommodationService.listDeleted()
    ]);

    if (requestId !== requestIdRef.current) return;

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
    if (!isAdmin) {
      requestIdRef.current += 1;
      setAccommodations([]);
      setDeletedAccommodations([]);
      setLoading(false);
      setError('');
      setDeletedError('');
      return;
    }

    loadAccommodations();
  }, [isAdmin, loadAccommodations]);

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
