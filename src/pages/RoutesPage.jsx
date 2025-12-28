import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import * as api from '../api/routes.js';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { routeSchema } from '../utils/validators.js';
import { parseDateTimeToUnix, formatUnix } from '../utils/formatters.js';

/*
  RoutesPage component: allows users to view, create, edit, and delete routes.
*/

export default function RoutesPage() {
  // State variables
  const toast = useToast(); // toast notifications
  const [routes, setRoutes] = useState([]); // list of Routes
  const [loading, setLoading] = useState(false); // loading state
  const [editing, setEditing] = useState(null); // currently editing route
  const [showForm, setShowForm] = useState(false); // form modal visibility
  const [confirmDelete, setConfirmDelete] = useState(null); // delete confirmation modal state

  // Form setup using react-hook-form and yup for validation
  const form = useForm({
    resolver: yupResolver(routeSchema),
    defaultValues: {
      Start: '',
      End: '',
      Stops: '',
      DateAndTime: '',
      OccupiedSeats: 0,
      Comment: ''
    }
  });

  // Fetch Routes from API
  async function refresh() {
    setLoading(true);
    try {
      const data = await api.listRoutes();
      setRoutes(data || []);
    } catch (err) {
      toast.push('error', err.message || 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  }

  // Initial data load
  useEffect(() => { refresh(); }, []);

  // Open form for adding a new route
  function openAdd() {
    setEditing(null);
    form.reset({
      Start: '',
      End: '',
      Stops: '',
      DateAndTime: '',
      OccupiedSeats: 0,
      Comment: ''
    });
    setShowForm(true);
  }

  // Open form for editing an existing route
  function openEdit(item) {
    setEditing(item);
    // Pre-fill with human-readable datetime-local value from existing unix seconds
    const dtLocal = item.DateAndTime ? new Date(item.DateAndTime * 1000).toISOString().slice(0,16) : '';
    form.reset({
      Start: item.Start,
      End: item.End,
      Stops: item.Stops,
      DateAndTime: dtLocal,
      OccupiedSeats: item.OccupiedSeats,
      Comment: item.Comment || ''
    });
    setShowForm(true);
  }

  // Handle form submission for creating or updating a route
  async function onSubmit(values) {
    const payload = {
      ...values,
      DateAndTime: parseDateTimeToUnix(values.DateAndTime)
    };
    try {
      if (editing) {
        const updated = await api.updateRoute(editing.RouteID, payload);
        setRoutes(routes.map(r => r.RouteID === editing.RouteID ? updated : r));
        toast.push('success', 'Route updated');
      } else {
        const created = await api.createRoute(payload);
        setRoutes([...routes, created]);
        toast.push('success', 'Route created');
      }
      setShowForm(false);
    } catch (err) {
      toast.push('error', err.message || 'Route save failed');
    }
  }

  // Handle route deletion after confirmation
  async function performDelete() {
    try {
      await api.deleteRoute(confirmDelete.RouteID);
      setRoutes(routes.filter(r => r.RouteID !== confirmDelete.RouteID));
      toast.push('success', 'Route deleted');
    } catch (err) {
      toast.push('error', err.message || 'Delete failed');
    } finally {
      setConfirmDelete(null);
    }
  }

  // Render component
  return (
    <div className="container">
      <div className="panel">
        <div className="flex space">
          <h2>Routes</h2>
          <button onClick={openAdd}>Create Route</button>
        </div>
        {loading && <p>Loading routes...</p>}
        {!loading && routes.length === 0 && <p>No routes available.</p>}
        <div className="grid cols-2">
          {routes.map(r => (
            <div className="card" key={r.RouteID}>
              <h4>{r.Start} → {r.End}</h4>
              <small>Stops: {r.Stops}</small>
              <small>Departure: {formatUnix(r.DateAndTime)}</small>
              <small>Seats occupied: {r.OccupiedSeats}</small>
              <div style={{ marginTop: '.4rem' }}>{r.Comment}</div>
              <div className="actions" style={{ marginTop: '.5rem' }}>
                <button onClick={() => openEdit(r)}>Edit</button>
                <button className="close-btn" onClick={() => setConfirmDelete(r)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? 'Edit Route' : 'Create Route'}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid" style={{ gap: '.75rem' }}>
          <label>Start
            <input {...form.register('Start')} />
            {form.formState.errors.Start && <div className="form-error">{form.formState.errors.Start.message}</div>}
          </label>
          <label>End
            <input {...form.register('End')} />
            {form.formState.errors.End && <div className="form-error">{form.formState.errors.End.message}</div>}
          </label>
          <label>Stops
            <input {...form.register('Stops')} />
            {form.formState.errors.Stops && <div className="form-error">{form.formState.errors.Stops.message}</div>}
          </label>
          <label>Date & Time
            <input type="datetime-local" {...form.register('DateAndTime')} />
            {form.formState.errors.DateAndTime && <div className="form-error">{form.formState.errors.DateAndTime.message}</div>}
          </label>
          <label>Occupied Seats
            <input type="number" {...form.register('OccupiedSeats')} />
            {form.formState.errors.OccupiedSeats && <div className="form-error">{form.formState.errors.OccupiedSeats.message}</div>}
          </label>
          <label>Comment
            <textarea rows={3} {...form.register('Comment')} />
          </label>
          <div className="actions">
            <button type="submit">{editing ? 'Update' : 'Create'}</button>
            <button type="button" className="close-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      </Modal>

      <Confirm
        open={!!confirmDelete}
        title="Delete Route"
        message="Are you sure you want to delete this route?"
        onConfirm={performDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

