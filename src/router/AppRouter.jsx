import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import MyCarsPage from '../pages/MyCarsPage.jsx';
import MyRoutesPage from '../pages/MyRoutesPage.jsx';
import MyRequestsPage from '../pages/MyRequestsPage.jsx';
import ReviewsPage from '../pages/ReviewsPage.jsx';
import UserProfilePage from '../pages/UserProfilePage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/my-cars"
        element={
          <ProtectedRoute>
            <MyCarsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-routes"
        element={
          <ProtectedRoute>
            <MyRoutesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute>
            <MyRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <ReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userID"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}