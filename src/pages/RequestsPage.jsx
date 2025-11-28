import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import * as api from '../api/requests.js';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { requestSchema } from '../utils/validators.js';
import { parseDateTimeToUnix, formatUnix } from '../utils/formatters.js';

export default function RequestsPage() {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const form = useForm({
    resolver: yupResolver(requestSchema),
    defaultValues: {
      Start: '',
      End: '',
      DateAndTime: '',
      Description: ''
    }
  });

  async function refresh() {
    setLoading(true);
    try {
      const data = await api.listRequests();
      setRequests(data || []);
    } catch (err) {
      toast.push('error', err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  function openAdd() {
    setEditing(null);
    form.reset({ Start: '', End: '', DateAndTime: '', Description: '' });
    setShowForm(true);
  }

  function openEdit(item) {
    setEditing(item);
    const dtLocal = item.DateAndTime ? new Date(item.DateAndTime * 1000).toISOString().slice(0,16) : '';
    form.reset({
      Start: item.Start,
      End: item.End,
      DateAndTime: dtLocal,
      Description: item.Description || ''
    });
    setShowForm(true);
  }

  async function onSubmit(values) {
    const payload = {
      ...values,
      DateAndTime: parseDateTimeToUnix(values.DateAndTime)
    };
    try {
      if (editing) {
        const updated = await api.updateRequest(editing.RequestID, payload);
        setRequests(requests.map(r => r.RequestID === editing.RequestID ? updated : r));
        toast.push('success', 'Request updated');
      } else {
        const created = await api.createRequest(payload);
        setRequests([...requests, created]);
        toast.push('success', 'Request created');
      }
      setShowForm(false);
    } catch (err) {
      toast.push('error', err.message || 'Request save failed');
    }
  }

  async function performDelete() {
    try {
      await api.deleteRequest(confirmDelete.RequestID);
      setRequests(requests.filter(r => r.RequestID !== confirmDelete.RequestID));
      toast.push('success', 'Request deleted');
    } catch (err) {
      toast.push('error', err.message || 'Delete failed');
    } finally {
      setConfirmDelete(null);
    }
  }

  return (
    <div className="container">
      <div className="panel">
        <div className="flex space">
          <h2>Requests</h2>
          <button onClick={openAdd}>Create Request</button>
        </div>
        {loading && <p>Loading requests...</p>}
        {!loading && requests.length === 0 && <p>No requests available.</p>}
        <div className="grid cols-2">
          {requests.map(r => (
            <div className="card" key={r.RequestID}>
              <h4>{r.Start} → {r.End}</h4>
              <small>Wanted at: {formatUnix(r.DateAndTime)}</small>
              <div style={{ marginTop: '.4rem' }}>{r.Description}</div>
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
        title={editing ? 'Edit Request' : 'Create Request'}
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
          <label>Date & Time
            <input type="datetime-local" {...form.register('DateAndTime')} />
            {form.formState.errors.DateAndTime && <div className="form-error">{form.formState.errors.DateAndTime.message}</div>}
          </label>
          <label>Description
            <textarea rows={3} {...form.register('Description')} />
          </label>
          <div className="actions">
            <button type="submit">{editing ? 'Update' : 'Create'}</button>
            <button type="button" className="close-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      </Modal>

      <Confirm
        open={!!confirmDelete}
        title="Delete Request"
        message="Are you sure you want to delete this request?"
        onConfirm={performDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}