import { useEffect, useState } from 'react';
import homeCatalogService from '../services/homeCatalogService';

const emptySections = { categories: [], hosts: [], locations: [] };

export default function useHomeCatalog() {
  const [sections, setSections] = useState(emptySections);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    homeCatalogService.getSections()
      .then((result) => {
        if (active) setSections(result);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { ...sections, loading, error };
}
