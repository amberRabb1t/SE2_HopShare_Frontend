import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../api/reviews.js';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useForm } from 'react-hook-form';
import { reviewSchema } from '../utils/validators.js';
import { yupResolver } from '@hookform/resolvers/yup';
import RatingStars from '../components/RatingStars.jsx';
import { formatUnix } from '../utils/formatters.js';

export default function ReviewsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [myReviews, setMyReviews] = useState([]);
  const [aboutReviews, setAboutReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const form = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      Rating: 0,
      UserType: true,
      Description: '',
      ReviewedUser: 0
    }
  });

  async function refresh() {
    if (!user?.UserID) return;
    setLoading(true);
    try {
      const mine = await api.listReviews(user.UserID, true);
      const about = await api.listReviews(user.UserID, false);
      setMyReviews(mine || []);
      setAboutReviews(about || []);
    } catch (err) {
      toast.push('error', err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [user?.UserID]);

  function openAdd() {
    setEditingReview(null);
    form.reset({ Rating: 0, UserType: true, Description: '', ReviewedUser: user?.UserID || 0 });
    setShowForm(true);
  }

  function openEdit(r) {
    setEditingReview(r);
    form.reset({
      Rating: r.Rating,
      UserType: r.UserType,
      Description: r.Description || '',
      ReviewedUser: r.ReviewedUser
    });
    setShowForm(true);
  }

  async function onSubmit(values) {
    try {
      if (editingReview) {
        const updated = await api.updateReview(user.UserID, editingReview.ReviewID, values);
        setMyReviews(myReviews.map(m => m.ReviewID === editingReview.ReviewID ? updated : m));
        toast.push('success', 'Review updated');
      } else {
        const created = await api.createReview(user.UserID, values);
        setMyReviews([...myReviews, created]);
        toast.push('success', 'Review posted');
      }
      setShowForm(false);
    } catch (err) {
      toast.push('error', err.message || 'Review save failed');
    }
  }

  async function performDelete() {
    try {
      await api.deleteReview(user.UserID, confirmDelete.ReviewID);
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
          <button onClick={openAdd}>Write Review</button>
        </div>
        {loading && <p>Loading reviews...</p>}
        <div className="separator" />
        <h3>Reviews About Me</h3>
        {aboutReviews.length === 0 && <p>No reviews about you.</p>}
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
        {myReviews.length === 0 && <p>You haven't written any reviews yet.</p>}
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
          <label>Reviewed User ID
            <input type="number" {...form.register('ReviewedUser')} />
            {form.formState.errors.ReviewedUser && <div className="form-error">{form.formState.errors.ReviewedUser.message}</div>}
          </label>
          <label>Description
            <textarea rows={4} {...form.register('Description')} />
          </label>
          <div className="actions">
            <button type="submit">{editingReview ? 'Update' : 'Post'}</button>
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