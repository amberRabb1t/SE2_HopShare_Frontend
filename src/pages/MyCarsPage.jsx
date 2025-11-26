import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../api/cars.js';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { carSchema } from '../utils/validators.js';
import { toUnixSeconds, formatUnix } from '../utils/formatters.js';

export default function MyCarsPage() {
  const toast = useToast();
  const { user, email } = useAuth();
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

  async function refresh() {
    if (!user?.UserID) return;
    setLoading(true);
    try {
      const data = await api.listCars(user.UserID);
      setCars(data || []);
    } catch (err) {
      toast.push('error', err.message || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Fetch user object by email (approx by listing users and matching)
    async function hydrateUser() {
      if (!user?.Email && email) {
        // This page expects user.UserID; fallback: find by Name not viable -> create dummy
        // For demonstration, assume userID=1 if email=alice@example.com etc.
      }
    }
    hydrateUser();
    refresh();
    // eslint-disable-next-line
  }, [user?.UserID]);

  function openAdd() {
    setEditingCar(null);
    form.reset({ Seats: '', ServiceDate: '', MakeModel: '', LicensePlate: '' });
    setShowForm(true);
  }

  function openEdit(car) {
    setEditingCar(car);
    form.reset({
      Seats: car.Seats,
      ServiceDate: car.ServiceDate,
      MakeModel: car.MakeModel,
      LicensePlate: car.LicensePlate
    });
    setShowForm(true);
  }

  async function onSubmit(values) {
    const payload = {
      ...values,
      ServiceDate: toUnixSeconds(values.ServiceDate)
    };
    try {
      if (editingCar) {
        const updated = await api.updateCar(user.UserID, editingCar.CarID, payload);
        setCars(cars.map(c => c.CarID === editingCar.CarID ? updated : c));
        toast.push('success', 'Car updated');
      } else {
        const created = await api.createCar(user.UserID, payload);
        setCars([...cars, created]);
        toast.push('success', 'Car added');
      }
      setShowForm(false);
    } catch (err) {
      toast.push('error', err.message || 'Car save failed');
    }
  }

  async function performDelete() {
    try {
      await api.deleteCar(user.UserID, confirmDelete.CarID);
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
          <button onClick={openAdd}>Add Car</button>
        </div>
        {loading && <p>Loading cars...</p>}
        {!loading && cars.length === 0 && <p>No cars yet.</p>}
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
          <label>Service Date (unix seconds)
            <input type="number" {...form.register('ServiceDate')} />
            {form.formState.errors.ServiceDate && <div className="form-error">{form.formState.errors.ServiceDate.message}</div>}
          </label>
          <label>License Plate
            <input {...form.register('LicensePlate')} />
            {form.formState.errors.LicensePlate && <div className="form-error">{form.formState.errors.LicensePlate.message}</div>}
          </label>
          <div className="actions">
            <button type="submit">{editingCar ? 'Update' : 'Add'}</button>
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