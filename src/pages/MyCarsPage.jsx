import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../api/cars.js';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { carSchema } from '../utils/validators.js';
import { parseDateToUnix, formatUnix } from '../utils/formatters.js';
import { listUsers } from '../api/users.js';

export default function MyCarsPage() {
  const toast = useToast();
  const { user, email, setUser } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const form = useForm({
    resolver: yupResolver(carSchema),
    defaultValues: {
      Seats: '',
      ServiceDate: '',
      MakeModel: '',
      LicensePlate: ''
    }
  });

  async function ensureUserID() {
    if (user?.UserID) return user.UserID;
    if (!email) return undefined;
    try {
      const all = await listUsers();
      const found = all.find(u => u.Email?.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        return found.UserID;
      }
    } catch {
      // swallow
    }
    return undefined;
  }

  async function refresh() {
    const id = await ensureUserID();
    if (!id) return;
    setLoading(true);
    try {
      const data = await api.listCars(id);
      setCars(data || []);
    } catch (err) {
      toast.push('error', err.message || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, [user?.UserID, email]);

  function openAdd() {
    setEditingCar(null);
    form.reset({ Seats: '', ServiceDate: '', MakeModel: '', LicensePlate: '' });
    setShowForm(true);
  }

  function openEdit(car) {
    setEditingCar(car);
    const dateLocal = car.ServiceDate ? new Date(car.ServiceDate * 1000).toISOString().slice(0,10) : '';
    form.reset({
      Seats: car.Seats,
      ServiceDate: dateLocal,
      MakeModel: car.MakeModel,
      LicensePlate: car.LicensePlate
    });
    setShowForm(true);
  }

  async function onSubmit(values) {
    const userID = await ensureUserID();
    if (!userID) {
      toast.push('error', 'User ID not resolved; cannot save car');
      return;
    }
    const payload = {
      ...values,
      ServiceDate: parseDateToUnix(values.ServiceDate)
    };
    try {
      if (editingCar) {
        const updated = await api.updateCar(userID, editingCar.CarID, payload);
        setCars(cars.map(c => c.CarID === editingCar.CarID ? updated : c));
        toast.push('success', 'Car updated');
      } else {
        const created = await api.createCar(userID, payload);
        setCars([...cars, created]);
        toast.push('success', 'Car added');
      }
      setShowForm(false);
    } catch (err) {
      toast.push('error', err.message || 'Car save failed');
    }
  }

  async function performDelete() {
    const userID = user?.UserID;
    if (!userID) {
      toast.push('error', 'User ID not resolved; cannot delete');
      setConfirmDelete(null);
      return;
    }
    try {
      await api.deleteCar(userID, confirmDelete.CarID);
      setCars(cars.filter(c => c.CarID !== confirmDelete.CarID));
      toast.push('success', 'Car deleted');
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
          <h2>My Cars</h2>
          <button onClick={openAdd} disabled={!user?.UserID}>Add Car</button>
        </div>
        {!user?.UserID && <p>Resolving user ID...</p>}
        {loading && <p>Loading cars...</p>}
        {!loading && cars.length === 0 && user?.UserID && <p>No cars yet.</p>}
        <div className="grid cols-2">
          {cars.map(c => (
            <div key={c.CarID} className="card">
              <h4>{c.MakeModel}</h4>
              <small>Seats: {c.Seats} • Plate: {c.LicensePlate}</small>
              <small>Service: {formatUnix(c.ServiceDate)}</small>
              <div className="actions" style={{ marginTop: '.5rem' }}>
                <button onClick={() => openEdit(c)}>Edit</button>
                <button className="close-btn" onClick={() => setConfirmDelete(c)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingCar ? 'Edit Car' : 'Add Car'}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid" style={{ gap: '.75rem' }}>
          <label>Make & Model
            <input {...form.register('MakeModel')} />
            {form.formState.errors.MakeModel && <div className="form-error">{form.formState.errors.MakeModel.message}</div>}
          </label>
          <label>Seats
            <input type="number" {...form.register('Seats')} />
            {form.formState.errors.Seats && <div className="form-error">{form.formState.errors.Seats.message}</div>}
          </label>
          <label>Service Date
            <input type="date" {...form.register('ServiceDate')} />
            {form.formState.errors.ServiceDate && <div className="form-error">{form.formState.errors.ServiceDate.message}</div>}
          </label>
          <label>License Plate
            <input {...form.register('LicensePlate')} />
            {form.formState.errors.LicensePlate && <div className="form-error">{form.formState.errors.LicensePlate.message}</div>}
          </label>
          <div className="actions">
            <button type="submit" disabled={!user?.UserID}>{editingCar ? 'Update' : 'Add'}</button>
            <button type="button" className="close-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      </Modal>

      <Confirm
        open={!!confirmDelete}
        title="Delete Car"
        message="Are you sure you want to delete this car?"
        onConfirm={performDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}

