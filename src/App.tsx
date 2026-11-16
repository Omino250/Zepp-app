import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ZeppProvider, useZepp } from './context/ZeppContext';
import { AppShell } from './components/layout/AppShell';
import { ToastStack } from './components/common/ToastStack';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { HomePage } from './pages/home/HomePage';
import { ExplorePage } from './pages/explore/ExplorePage';
import { CreatePage } from './pages/create/CreatePage';
import { VideosPage } from './pages/videos/VideosPage';
import { EventsPage } from './pages/events/EventsPage';
import { EventDetailPage } from './pages/events/EventDetailPage';
import { BusinessesPage } from './pages/business/BusinessesPage';
import { BusinessDetailPage } from './pages/business/BusinessDetailPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { SavedPage } from './pages/saved/SavedPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { SettingsPage } from './pages/settings/SettingsPage';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useZepp();
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (auth.needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

const ZeppRoutes: React.FC = () => {
  const { auth } = useZepp();

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            auth.isAuthenticated ? (
              <Navigate to={auth.needsOnboarding ? '/onboarding' : '/home'} replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            auth.isAuthenticated && !auth.needsOnboarding ? (
              <Navigate to="/home" replace />
            ) : (
              <RegisterPage />
            )
          }
        />
        <Route
          path="/onboarding"
          element={
            auth.isAuthenticated ? (
              <OnboardingPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/businesses" element={<BusinessesPage />} />
          <Route path="/businesses/:businessId" element={<BusinessDetailPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route
          path="*"
          element={
            <Navigate
              to={auth.isAuthenticated ? '/home' : '/login'}
              replace
            />
          }
        />
      </Routes>
      {!auth.isAuthenticated && <ToastStack />}
    </>
  );
};

export default function App() {
  return (
    <ZeppProvider>
      <BrowserRouter>
        <ZeppRoutes />
      </BrowserRouter>
    </ZeppProvider>
  );
}
