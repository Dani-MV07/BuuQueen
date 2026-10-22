import { createContext, useCallback, useEffect, useState } from 'react';
import experienceService from '../services/experienceService';

export const ExperiencesContext = createContext(null);

export function ExperiencesProvider({ children }) {
  const [experiences, setExperiences] = useState([]);
  const [deletedExperiences, setDeletedExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    setError('');
    setDeletedError('');
    const [activeResult, deletedResult] = await Promise.allSettled([
      experienceService.list(),
      experienceService.listDeleted()
    ]);

    if (activeResult.status === 'fulfilled') {
      setExperiences(activeResult.value);
    } else {
      setError(activeResult.reason.message);
    }

    if (deletedResult.status === 'fulfilled') {
      setDeletedExperiences(deletedResult.value);
    } else {
      setDeletedError(deletedResult.reason.message);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const createExperience = useCallback(async (data) => {
    const created = await experienceService.create(data);
    setExperiences((current) => [...current, created]);
    return created;
  }, []);

  const updateExperience = useCallback(async (id, data) => {
    const updated = await experienceService.update(id, data);
    setExperiences((current) => current.map((item) => (
      item._id === id ? updated : item
    )));
    return updated;
  }, []);

  const setExperienceActive = useCallback(async (id, isActive) => {
    const updated = await experienceService.setActive(id, isActive);
    setExperiences((current) => current.map((item) => (
      item._id === id ? updated : item
    )));
    return updated;
  }, []);

  const setExperienceStatus = useCallback(async (id, status) => {
    const updated = await experienceService.setStatus(id, status);
    setExperiences((current) => current.map((item) => (
      item._id === id ? updated : item
    )));
    return updated;
  }, []);

  const removeExperience = useCallback(async (id) => {
    const deletedExperience = experiences.find((item) => item._id === id);
    await experienceService.remove(id);
    setExperiences((current) => current.filter((item) => item._id !== id));
    if (deletedExperience) {
      setDeletedExperiences((deletedCurrent) => [
        { ...deletedExperience, deletedAt: new Date().toISOString() },
        ...deletedCurrent.filter((item) => item._id !== id)
      ]);
    }
  }, [experiences]);

  const restoreExperience = useCallback(async (id) => {
    const restored = await experienceService.restore(id);
    setDeletedExperiences((current) => current.filter((item) => item._id !== id));
    setExperiences((current) => [restored, ...current.filter((item) => item._id !== id)]);
    return restored;
  }, []);

  const value = {
    experiences,
    deletedExperiences,
    loading,
    error,
    deletedError,
    loadExperiences,
    createExperience,
    updateExperience,
    setExperienceActive,
    setExperienceStatus,
    removeExperience,
    restoreExperience
  };

  return (
    <ExperiencesContext.Provider value={value}>
      {children}
    </ExperiencesContext.Provider>
  );
}
