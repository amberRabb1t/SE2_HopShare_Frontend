import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as usersApi from '../api/users.js';
import * as reportsApi from '../api/reports.js';
import { useToast } from '../context/ToastContext.jsx';
import Modal from '../components/Modal.jsx';
import { useForm } from 'react-hook-form';
import { reportSchema } from '../utils/validators.js';
import { yupResolver } from '@hookform/resolvers/yup';

export default function UserProfilePage() {
  const { userID } = useParams();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const form = useForm({
    resolver: yupResolver(reportSchema),
    defaultValues: {
      Description: '',
      ReportedUser: Number(userID)
    }
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const u = await usersApi.getUser(userID);
        setUser(u);
      } catch (err) {
        toast.push('error', err.message || 'Failed to load user');
      }
    }
    fetchUser();
  }, [userID, toast]);

  async function submitReport(values) {
    try {
      const created = await reportsApi.createReport(values);
      toast.push('success', 'Report filed');
      setShowReport(false);
    } catch (err) {
      toast.push('error', err.message || 'Report failed');
    }
  }

  return (
    <div className="container">
      <div className="panel">
        {!user && <p>Loading profile...</p>}
        {user && (
          <>
            <h2>{user.Name}</h2>
            <p>Email: {user.Email}</p>
            <div style={{ marginTop: '.5rem' }}>
              <span className="badge">Driver ★ {user.DriverRating ?? 'N/A'}</span>
              <span className="badge">Passenger ★ {user.PassengerRating ?? 'N/A'}</span>
            </div>
            <div className="actions" style={{ marginTop: '1rem' }}>
              <button onClick={() => setShowReport(true)}>Report User</button>
            </div>
          </>
        )}
      </div>

      <Modal
        open={showReport}
        onClose={() => setShowReport(false)}
        title="File Report"
      >
        <form onSubmit={form.handleSubmit(submitReport)} className="grid" style={{ gap: '.75rem' }}>
          <label>Description
            <textarea rows={5} {...form.register('Description')} />
            {form.formState.errors.Description && <div className="form-error">{form.formState.errors.Description.message}</div>}
          </label>
          <input type="hidden" {...form.register('ReportedUser')} />
          <div className="actions">
            <button type="submit">File</button>
            <button type="button" className="close-btn" onClick={() => setShowReport(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}