import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import { Toaster } from 'react-hot-toast'
import ListBookings from './pages/admin/ListBookings'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import Dashboard from './pages/admin/Dashboard'
import Layout from './pages/admin/Layout'
import { useAppContext } from './hooks/useAppContext'
import { SignIn } from '@clerk/clerk-react'
const App = () => {
  const isAdminRoute=useLocation().pathname.startsWith('/admin')

  const{user, isAdmin}=useAppContext()
  
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/admin/*" element={user && isAdmin ? <Layout />:(
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={"/admin"}/>
          </div>
        )} >
          // This route sets the default (index) page for the /admin path to the Dashboard component.
          <Route index element={<Dashboard />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App
