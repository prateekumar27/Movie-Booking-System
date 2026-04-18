import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Movies from "./pages/Movies";
import Header from "./pages/UI/Header";
import Footer from "./pages/UI/Footer";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import CheckOut from "./pages/CheckOut";
import { useMatch } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useLoadUser } from "./hooks/useLoadUser";
import FullScreenLoader from "./pages/UI/FullScreenLoader";
import { useAuth } from "./context/AuthContext";



const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth ? <Outlet /> : <Navigate to="/" replace />;
};

const App = () => {
  const { isLoading } = useLoadUser();

  //Hide header and footer on seatLayout page
  const isSeatLayoutPage = useMatch(
    "/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout",
  );

  const isCheckOutPage = useMatch("/shows/:showId/:state/checkout");

  if (isLoading) return <FullScreenLoader />;
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />
      <div className="flex flex-col min-h-screen">
        {!isSeatLayoutPage && !isCheckOutPage && <Header />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/profile" element={<Profile />} /> */}

            <Route path="/movies" element={<Movies />} />
            <Route
              path="/movies/:state/:movieName/:id/ticket"
              element={<MovieDetails />}
            />
            <Route element={<PrivateRoute />}>
              <Route
                path="/movies/:movieId/:movieName/:state/theater/:theaterId/show/:showId/seat-layout"
                element={<SeatLayout />}
              />
              <Route path="/profile/:id" element={<Profile />} />
            </Route>
            <Route
              path="/shows/:showId/:state/checkout"
              element={<CheckOut />}
            />
          </Routes>
        </main>
        {!isSeatLayoutPage && !isCheckOutPage && <Footer />}
      </div>
    </>
  );
};

export default App;
