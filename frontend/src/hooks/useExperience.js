import { useCallback, useEffect, useState } from 'react';
import experienceService from '../services/experienceService';

export function useExperience(id) {
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) {
      setExperience(null);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await experienceService.get(id);
      setExperience(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { experience, loading, error, reload: load };
}
