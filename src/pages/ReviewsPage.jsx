import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../api/reviews.js';
import { listUsers } from '../api/users.js';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import UserSelectModal from '../components/UserSelectModal.jsx';
import { useForm } from 'react-hook-form';
import { reviewSchema } from '../utils/validators.js';
import { yupResolver } from '@hookform/resolvers/yup';
import RatingStars from '../components/RatingStars.jsx';
import { formatUnix } from '../utils/formatters.js';
import { resolveUsernameForReview } from '../utils/userLookup.js';

export default function ReviewsPage() {
  const toast = useToast();
  const { user, email, setUser } = useAuth();
  const [myReviews, setMyReviews] = useState([]);
  const [aboutReviews, setAboutReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Disambiguation state
  const [disambiguateOpen, setDisambiguateOpen] = useState(false);
  const [candidateUsers, setCandidateUsers] = useState([]);
  const [pendingPayload, setPendingPayload] = useState(null); // stores form values while selecting candidate

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
      const all = await listUsers();
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
    form.reset({ Rating: 0, UserType: true, Description: '', ReviewedUserName: '' });
    setShowForm(true);
  }

  async function openEdit(r) {
    setEditingReview(r);
    // Resolve display username from ReviewedUser ID (best effort)
    let username = '';
    try {
      const all = await listUsers(r.Name || '');
      const match = all.find(u => u.UserID === r.ReviewedUser);
      if (match) username = match.Name;
    } catch { /* ignore */ }
    form.reset({
      Rating: r.Rating,
      UserType: r.UserType,
      Description: r.Description || '',
      ReviewedUserName: username
    });
    setShowForm(true);
  }

  async function createOrUpdate(authorId, reviewedUserId, values) {
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
    setEditingReview(null);
  }

  async function onSubmit(values) {
    const authorId = await ensureUserID();
    if (!authorId) {
      toast.push('error', 'User ID not resolved; cannot save review');
      return;
    }

    // Editing: ReviewedUserName is read-only; just use existing ReviewedUser
    if (editingReview) {
      await createOrUpdate(authorId, editingReview.ReviewedUser, values);
      return;
    }

    // New review: resolve username
    try {
      const resolution = await resolveUsernameForReview(values.ReviewedUserName);
      if (resolution.error) {
        toast.push('error', resolution.error);
        return;
      }
      if (resolution.disambiguate) {
        setCandidateUsers(resolution.candidates);
        setPendingPayload({ authorId, values });
        setDisambiguateOpen(true);
        return;
      }
      // Unambiguous
      await createOrUpdate(authorId, resolution.resolvedUserID, values);
    } catch (err) {
      toast.push('error', err.message || 'Failed to resolve username');
    }
  }

  function handleCandidateSelect(userObj) {
    setDisambiguateOpen(false);
    if (!pendingPayload || !userObj?.UserID) {
      toast.push('error', 'Invalid selection');
      return;
    }
    createOrUpdate(pendingPayload.authorId, userObj.UserID, pendingPayload.values)
      .catch(err => toast.push('error', err.message || 'Failed to save review'));
    setPendingPayload(null);
    setCandidateUsers([]);
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
        onClose={() => { setShowForm(false); setEditingReview(null); }}
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
              placeholder="Exact username"
            />
            {form.formState.errors.ReviewedUserName && <div className="form-error">{form.formState.errors.ReviewedUserName.message}</div>}
          </label>
          <label>Description
            <textarea rows={4} {...form.register('Description')} />
          </label>
          <div className="actions">
            <button type="submit" disabled={!user?.UserID}>{editingReview ? 'Update' : 'Post'}</button>
            <button type="button" className="close-btn" onClick={() => { setShowForm(false); setEditingReview(null); }}>Cancel</button>
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

      <UserSelectModal
        open={disambiguateOpen}
        onClose={() => { setDisambiguateOpen(false); setPendingPayload(null); setCandidateUsers([]); }}
        candidates={candidateUsers}
        onSelect={handleCandidateSelect}
      />
    </div>
  );
}

