import Layout from "./components/shared/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import BookPage from "./pages/BookPage";
import AboutPage from "./pages/AboutPage";
import SearchPage from "./pages/SearchPage";
import NotFoundPage from "./pages/NotFoundPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext"; // Import useAuth and AuthProvider
import FAQPage from "./pages/FAQPage";
import BlogPage from "./pages/BlogPage";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/books/:id" element={<BookPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/faq" element={<FAQPage />} />
          </Route>

          {/* Route requiring authentication */}
          <Route path="/" element={<Layout />}>
            <Route path="/profile" element={<PrivateRoute />} />
          </Route>

          {/* Login route */}
          <Route path="/login" element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Not found page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute() {
  const { user, loading, error } = useAuth();

  // While loading, we can render a loading indicator or a blank screen
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there's an error, render the NotFoundPage
  if (error) {
    return <NotFoundPage />;
  }

  // If there's no user (i.e., not authenticated), redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the profile page
  return <ProfilePage />;
}

// PublicRoute will ensure that the login page is not accessible when the user is already authenticated
function PublicRoute() {
  const { user, error } = useAuth();

  // If there's an error, render the NotFoundPage
  if (error) {
    return <NotFoundPage />;
  }

  if (user) {
    // If the user is already logged in, redirect them to the homepage
    return <Navigate to="/home" />;
  }

  return <LoginPage />;
}

export default App;
