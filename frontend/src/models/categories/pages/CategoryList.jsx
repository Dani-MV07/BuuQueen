import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import categoryService from '../services/categoryService';
import { confirmAction } from '../../../utils/SweetAlert';

const statusOptions = new Map([
  ['active', 'Activa'],
  ['draft', 'Borrador'],
  ['archived', 'Archivada'],
  ['inactive', 'Inactiva']
]);

function getStatusLabel(status) {
  return statusOptions.get(status) || status || 'Sin estado';
}

function formatCreatedDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
}

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pendingActions, setPendingActions] = useState({});

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    setDeletedError('');
    const [activeResult, deletedResult] = await Promise.allSettled([
      categoryService.list(),
      categoryService.listDeleted()
    ]);

    if (activeResult.status === 'fulfilled') {
      setCategories(activeResult.value);
    } else {
      setError(activeResult.reason.message);
    }

    if (deletedResult.status === 'fulfilled') {
      setDeletedCategories(deletedResult.value);
    } else {
      setDeletedError(deletedResult.reason.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  function setPending(id, action, pending) {
    setPendingActions((current) => ({ ...current, [`${id}:${action}`]: pending }));
  }

  async function toggleActive(category) {
    setActionError('');
    setPending(category._id, 'active', true);
    try {
      await categoryService.setActive(category._id, !category.isActive);
      await reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(category._id, 'active', false);
    }
  }

  async function changeStatus(category) {
    const options = new Map(statusOptions);
    if (category.status && !options.has(category.status)) {
      options.set(category.status, `Mantener estado actual: ${category.status}`);
    }

    const result = await Swal.fire({
      title: 'Cambiar estado de la categoría',
      input: 'select',
      inputOptions: Object.fromEntries(options),
      inputValue: category.status || 'active',
      inputPlaceholder: 'Selecciona un estado',
      showCancelButton: true,
      confirmButtonText: 'Guardar estado',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#003b95',
      inputValidator: (value) => value ? undefined : 'Selecciona un estado.'
    });

    if (!result.isConfirmed || result.value === category.status) return;

    setActionError('');
    setPending(category._id, 'status', true);
    try {
      await categoryService.setStatus(category._id, result.value);
      await reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(category._id, 'status', false);
    }
  }

  async function remove(category) {
    const confirmed = await confirmAction({
      title: '¿Mover esta categoría a eliminados?',
      text: `"${category.name}" dejará de estar disponible. Podrás recuperarla más tarde.`,
      confirmButtonText: 'Eliminar'
    });
    if (!confirmed) return;

    setActionError('');
    setPending(category._id, 'delete', true);
    try {
      await categoryService.remove(category._id);
      await reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(category._id, 'delete', false);
    }
  }

  async function restore(category) {
    setActionError('');
    setPending(category._id, 'restore', true);
    try {
      await categoryService.restore(category._id);
      await reload();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setPending(category._id, 'restore', false);
    }
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-card">
        <header className="dashboard-heading">
          <div>
            <p className="eyebrow">GESTIÓN DEL CATÁLOGO</p>
            <h1>Categorías</h1>
            <p className="dashboard-subtitle">Organiza los alojamientos y administra sus categorías.</p>
          </div>
          <Link className="button create-button" to="/categories/new">
            <span aria-hidden="true">＋</span> Crear categoría
          </Link>
        </header>

        {actionError && <div className="alert error" role="alert">{actionError}</div>}
        {error && <ErrorState message={error} onRetry={reload} />}

        {loading ? (
          <Skeleton rows={4} />
        ) : error ? null : categories.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">◇</span>
            <h2>Aún no hay categorías</h2>
            <p>Crea una categoría para empezar a organizar tus alojamientos.</p>
            <Link className="button" to="/categories/new">Crear categoría</Link>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="accommodations-table categories-table">
              <thead>
                <tr>
                  <th scope="col">Categoría</th>
                  <th scope="col">Fecha de alta</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Disponibilidad</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>
                      <div className="accommodation-name category-name">
                        <strong>{category.name}</strong>
                        {category.description?.trim() && (
                          <span title={category.description.trim()}>{category.description.trim()}</span>
                        )}
                      </div>
                    </td>
                    <td className="accommodation-date">{formatCreatedDate(category.createdAt)}</td>
                    <td>
                      <button
                        className="status-badge"
                        type="button"
                        onClick={() => changeStatus(category)}
                        disabled={Boolean(pendingActions[`${category._id}:status`])}
                        title="Cambiar estado"
                      >
                        {pendingActions[`${category._id}:status`] ? 'Guardando…' : getStatusLabel(category.status)}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`active-badge ${category.isActive ? 'is-active' : 'is-inactive'}`}
                        type="button"
                        onClick={() => toggleActive(category)}
                        disabled={Boolean(pendingActions[`${category._id}:active`])}
                        aria-label={`${category.isActive ? 'Desactivar' : 'Activar'} ${category.name}`}
                        aria-pressed={Boolean(category.isActive)}
                        title="Cambiar disponibilidad"
                      >
                        {pendingActions[`${category._id}:active`]
                          ? 'Guardando…'
                          : category.isActive ? 'Disponible' : 'No disponible'}
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link
                          className="icon-button edit-action"
                          to={`/categories/${category._id}/edit`}
                          aria-label={`Editar ${category.name}`}
                          title="Editar categoría"
                        >
                          <span aria-hidden="true">✎</span>
                        </Link>
                        <button
                          className="icon-button delete-action"
                          type="button"
                          onClick={() => remove(category)}
                          disabled={Boolean(pendingActions[`${category._id}:delete`])}
                          aria-label={`Eliminar ${category.name}`}
                          title="Eliminar categoría"
                        >
                          <span aria-hidden="true">⌫</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <section className="deleted-section" aria-labelledby="deleted-categories-heading">
          <header className="deleted-heading">
            <div>
              <h2 id="deleted-categories-heading">Categorías eliminadas</h2>
              <p>Las categorías eliminadas se conservan y puedes recuperarlas cuando quieras.</p>
            </div>
            <span className="deleted-count">{deletedCategories.length}</span>
          </header>
          {deletedError && <div className="alert error" role="alert">{deletedError}</div>}
          {deletedCategories.length > 0 && (
            <div className="table-scroll">
              <table className="accommodations-table deleted-table">
                <thead>
                  <tr>
                    <th scope="col">Categoría</th>
                    <th scope="col">Fecha de eliminación</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedCategories.map((category) => (
                    <tr key={category._id}>
                      <td><strong>{category.name}</strong></td>
                      <td className="accommodation-date">{formatCreatedDate(category.deletedAt)}</td>
                      <td>
                        <button
                          className="button restore-button"
                          type="button"
                          onClick={() => restore(category)}
                          disabled={Boolean(pendingActions[`${category._id}:restore`])}
                        >
                          {pendingActions[`${category._id}:restore`] ? 'Recuperando…' : 'Recuperar categoría'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}
