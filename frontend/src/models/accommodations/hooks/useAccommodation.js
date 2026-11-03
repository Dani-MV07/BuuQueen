import { useCallback, useEffect, useState } from 'react';
import accommodationService from '../services/accommodationService';

export function useAccommodation(id) {
  const [accommodation, setAccommodation] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) {
      setAccommodation(null);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await accommodationService.get(id);
      setAccommodation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { accommodation, loading, error, reload: load };
}
