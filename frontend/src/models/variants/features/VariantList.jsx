import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ErrorState from '../../../components/shared/ErrorState';
import Skeleton from '../../../components/shared/Skeleton';
import variantService from '../services/variantService';
import { confirmAction } from '../../../utils/SweetAlert';

const statuses = new Map([['available', 'Disponible'], ['unavailable', 'No disponible'], ['draft', 'Borrador'], ['archived', 'Archivado']]);
const dateLabel = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—';
const title = (variant) => variant.sku || 'Variante';
const formatPrice = (price) => new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR'
}).format(price);
const subtitle = (variant) => [
  variant.accommodation_id?.title ? `Alojamiento: ${variant.accommodation_id.title}` : '',
].filter(Boolean).join(' · ');

export default function VariantList() {
  const [variants, setVariants] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletedError, setDeletedError] = useState('');
  const [actionError, setActionError] = useState('');
  const [pending, setPending] = useState({});
  const reload = useCallback(async () => {
    setLoading(true); setError(''); setDeletedError('');
    const [active, removed] = await Promise.allSettled([variantService.list(), variantService.listDeleted()]);
    if (active.status === 'fulfilled') setVariants(active.value); else setError(active.reason.message);
    if (removed.status === 'fulfilled') setDeleted(removed.value); else setDeletedError(removed.reason.message);
    setLoading(false);
  }, []);
  useEffect(() => { reload(); }, [reload]);
  function setAction(id, action, value) { setPending((current) => ({ ...current, [`${id}:${action}`]: value })); }
  async function perform(variant, action, callback) {
    setActionError(''); setAction(variant._id, action, true);
    try { await callback(); await reload(); } catch (err) { setActionError(err.message); }
    finally { setAction(variant._id, action, false); }
  }
  async function changeStatus(variant) {
    const options = Object.fromEntries(statuses);
    if (variant.status && !Object.hasOwn(options, variant.status)) options[variant.status] = `Mantener estado actual: ${variant.status}`;
    const result = await Swal.fire({ title: 'Cambiar estado de la variante', input: 'select', inputOptions: options, inputValue: variant.status || 'available', showCancelButton: true, confirmButtonText: 'Guardar estado', cancelButtonText: 'Cancelar', confirmButtonColor: '#003b95' });
    if (result.isConfirmed && result.value !== variant.status) await perform(variant, 'status', () => variantService.setStatus(variant._id, result.value));
  }
  async function remove(variant) {
    if (await confirmAction({ title: '¿Mover variante a eliminados?', text: `"${title(variant)}" podrá recuperarse más tarde.`, confirmButtonText: 'Eliminar' })) {
      await perform(variant, 'delete', () => variantService.remove(variant._id));
    }
  }
  return (
    <section className="dashboard-page"><div className="dashboard-card">
      <header className="dashboard-heading"><div><p className="eyebrow">GESTIÓN DEL CATÁLOGO</p><h1>Variantes</h1><p className="dashboard-subtitle">Administra precios, stock y capacidad de cada alojamiento.</p></div><Link className="button create-button" to="/variants/new"><span aria-hidden="true">＋</span> Crear variante</Link></header>
      {actionError && <div className="alert error" role="alert">{actionError}</div>}{error && <ErrorState message={error} onRetry={reload} />}
      {loading ? <Skeleton rows={4} /> : error ? null : variants.length === 0 ? <div className="empty-state"><span className="empty-icon" aria-hidden="true">◇</span><h2>Aún no hay variantes</h2><p>Crea una variante para un alojamiento.</p><Link className="button" to="/variants/new">Crear variante</Link></div> : (
        <div className="table-scroll"><table className="accommodations-table management-table details-table variant-details-table"><thead><tr><th>Variante</th><th>Precio</th><th>Stock</th><th>Plazas</th><th>Fecha de alta</th><th>Estado</th><th>Disponibilidad</th><th>Acciones</th></tr></thead><tbody>{variants.map((variant) => <tr key={variant._id}>
          <td><div className="accommodation-name"><strong>{title(variant)}</strong><span>{subtitle(variant)}</span></div></td>
          <td className="accommodation-date">{Number.isFinite(variant.price) ? formatPrice(variant.price) : '—'}</td>
          <td className="accommodation-date">{Number.isFinite(variant.stock) ? variant.stock : '—'}</td>
          <td className="accommodation-date">{Number.isFinite(variant.capacity) ? variant.capacity : '—'}</td>
          <td className="accommodation-date">{dateLabel(variant.createdAt)}</td>
          <td><button className="status-badge" type="button" onClick={() => changeStatus(variant)} disabled={pending[`${variant._id}:status`]}>{pending[`${variant._id}:status`] ? 'Guardando…' : statuses.get(variant.status) || variant.status || 'Sin estado'}</button></td>
          <td><button className={`active-badge ${variant.isActive ? 'is-active' : 'is-inactive'}`} type="button" onClick={() => perform(variant, 'active', () => variantService.setActive(variant._id, !variant.isActive))} disabled={pending[`${variant._id}:active`]}>{pending[`${variant._id}:active`] ? 'Guardando…' : variant.isActive ? 'Disponible' : 'No disponible'}</button></td>
          <td><div className="row-actions"><Link className="icon-button edit-action" to={`/variants/${variant._id}/edit`} aria-label={`Editar ${title(variant)}`}>✎</Link><button className="icon-button delete-action" type="button" onClick={() => remove(variant)} disabled={pending[`${variant._id}:delete`]} aria-label={`Eliminar ${title(variant)}`}>⌫</button></div></td>
        </tr>)}</tbody></table></div>
      )}
      <section className="deleted-section"><header className="deleted-heading"><div><h2>Variantes eliminadas</h2><p>Puedes recuperar las variantes eliminadas.</p></div><span className="deleted-count">{deleted.length}</span></header>
        {deletedError && <div className="alert error" role="alert">{deletedError}</div>}
        {deleted.length > 0 && <div className="table-scroll"><table className="accommodations-table deleted-table details-table variant-details-table"><thead><tr><th>Variante</th><th>Precio</th><th>Stock</th><th>Plazas</th><th>Eliminada</th><th>Acciones</th></tr></thead><tbody>{deleted.map((variant) => <tr key={variant._id}><td><strong>{title(variant)}</strong></td><td className="accommodation-date">{Number.isFinite(variant.price) ? formatPrice(variant.price) : '—'}</td><td className="accommodation-date">{Number.isFinite(variant.stock) ? variant.stock : '—'}</td><td className="accommodation-date">{Number.isFinite(variant.capacity) ? variant.capacity : '—'}</td><td className="accommodation-date">{dateLabel(variant.deletedAt)}</td><td><button className="button restore-button" type="button" onClick={() => perform(variant, 'restore', () => variantService.restore(variant._id))} disabled={pending[`${variant._id}:restore`]}>{pending[`${variant._id}:restore`] ? 'Recuperando…' : 'Recuperar variante'}</button></td></tr>)}</tbody></table></div>}
      </section>
    </div></section>
  );
}
