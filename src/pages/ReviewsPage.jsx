import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../api/reviews.js';
import * as usersApi from '../api/users.js';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useForm } from 'react-hook-form';
import { reviewSchema } from '../utils/validators.js';
import { yupResolver } from '@hookform/resolvers/yup';
import RatingStars from '../components/RatingStars.jsx';
import { formatUnix } from '../utils/formatters.js';
import { resolveUsernameToId } from '../utils/userLookup.js';

export default function ReviewsPage() {
  const toast = useToast();
  const { user, email, setUser } = useAuth();
  const [myReviews, setMyReviews] = useState([]);
  const [aboutReviews, setAboutReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [resolvedUsername, setResolvedUsername] = useState(''); // for editing display

  const form = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      Rating: 0,
      UserType: true,
      Description: '',
      ReviewedUserName: ''
    }
  });

  async function ensureUserID() {
    if (user?.UserID) return user.UserID;
    if (!email) return undefined;
    try {
      const all = await usersApi.listUsers();
      const found = (all || []).find(u => u.Email?.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        return found.UserID;
      }
    } catch { /* ignore */ }
    return undefined;
  }

  async function refresh() {
    const id = await ensureUserID();
    if (!id) return;
    setLoading(true);
    try {
      const mine = await api.listReviews(id, true);
      const about = await api.listReviews(id, false);
      setMyReviews(mine || []);
      setAboutReviews(about || []);
    } catch (err) {
      toast.push('error', err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [user?.UserID, email]);

  function openAdd() {
    setEditingReview(null);
    setResolvedUsername('');
    form.reset({ Rating: 0, UserType: true, Description: '', ReviewedUserName: '' });
    setShowForm(true);
  }

  async function openEdit(r) {
    setEditingReview(r);
    // Resolve username from ReviewedUser ID
    let username = '';
    try {
      const all = await usersApi.listUsers();
      const match = all.find(u => u.UserID === r.ReviewedUser);
      if (match) username = match.Name;
    } catch { /* ignore */ }
    setResolvedUsername(username);
    form.reset({
      Rating: r.Rating,
      UserType: r.UserType,
      Description: r.Description || '',
      ReviewedUserName: username // show resolved username (read-only field when editing)
    });
    setShowForm(true);
  }

  async function onSubmit(values) {
    const authorId = await ensureUserID();
    if (!authorId) {
      toast.push('error', 'User ID not resolved; cannot save review');
      return;
    }

    try {
      let reviewedUserId;
      if (editingReview) {
        // Editing: keep existing ReviewedUser ID; ignore username change (read-only)
        reviewedUserId = editingReview.ReviewedUser;
      } else {
        reviewedUserId = await resolveUsernameToId(values.ReviewedUserName);
      }

      const payload = {
        Rating: values.Rating,
        UserType: values.UserType === true || values.UserType === 'true',
        Description: values.Description || '',
        ReviewedUser: reviewedUserId
      };

      if (editingReview) {
        const updated = await api.updateReview(authorId, editingReview.ReviewID, payload);
        setMyReviews(myReviews.map(m => m.ReviewID === editingReview.ReviewID ? updated : m));
        toast.push('success', 'Review updated');
      } else {
        const created = await api.createReview(authorId, payload);
        setMyReviews([...myReviews, created]);
        toast.push('success', 'Review posted');
      }
      setShowForm(false);
    } catch (err) {
      toast.push('error', err.message || 'Review save failed');
    }
  }

  async function performDelete() {
    const id = user?.UserID;
    if (!id) {
      toast.push('error', 'User ID not resolved; cannot delete');
      setConfirmDelete(null);
      return;
    }
    try {
      await api.deleteReview(id, confirmDelete.ReviewID);
      setMyReviews(myReviews.filter(r => r.ReviewID !== confirmDelete.ReviewID));
      toast.push('success', 'Review deleted');
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
          <h2>Reviews</h2>
          <button onClick={openAdd} disabled={!user?.UserID}>Write Review</button>
        </div>
        {!user?.UserID && <p>Resolving user ID...</p>}
        {loading && <p>Loading reviews...</p>}
        <div className="separator" />
        <h3>Reviews About Me</h3>
        {aboutReviews.length === 0 && user?.UserID && <p>No reviews about you.</p>}
        <div className="grid cols-2">
          {aboutReviews.map(r => (
            <div className="card" key={r.ReviewID}>
              <h4>{r.UserType ? 'Driver' : 'Passenger'} Rating: {r.Rating}/5</h4>
              <small>{r.Description}</small>
              <small>Timestamp: {formatUnix(r.Timestamp)}</small>
            </div>
          ))}
        </div>
        <div className="separator" />
        <h3>My Reviews</h3>
        {myReviews.length === 0 && user?.UserID && <p>You haven't written any reviews yet.</p>}
        <div className="grid cols-2">
          {myReviews.map(r => (
            <div className="card" key={r.ReviewID}>
              <h4>{r.UserType ? 'Driver' : 'Passenger'} Rating: {r.Rating}/5</h4>
              <small>{r.Description}</small>
              <small>Timestamp: {formatUnix(r.Timestamp)}</small>
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
        title={editingReview ? 'Edit Review' : 'Write Review'}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid" style={{ gap: '.75rem' }}>
          <div>
            <label>Rating</label>
            <RatingStars
              value={form.watch('Rating')}
              onChange={(val) => form.setValue('Rating', val)}
            />
            {form.formState.errors.Rating && <div className="form-error">{form.formState.errors.Rating.message}</div>}
          </div>
          <label>User Type
            <select {...form.register('UserType')}>
              <option value="true">Driver</option>
              <option value="false">Passenger</option>
            </select>
          </label>
          <label>{editingReview ? 'Reviewed User (username)' : 'Reviewed User Username'}
            <input
              type="text"
              {...form.register('ReviewedUserName')}
              readOnly={!!editingReview}
              placeholder="Exact username (case-insensitive)"
            />
            {form.formState.errors.ReviewedUserName && <div className="form-error">{form.formState.errors.ReviewedUserName.message}</div>}
          </label>
          <label>Description
            <textarea rows={4} {...form.register('Description')} />
          </label>
          <div className="actions">
            <button type="submit" disabled={!user?.UserID}>{editingReview ? 'Update' : 'Post'}</button>
            <button type="button" className="close-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      </Modal>

      <Confirm
        open={!!confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete your review?"
        onConfirm={performDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}