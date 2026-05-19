import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AdminLayout } from './components/admin/AdminLayout'
import { Home } from './pages/Home'
import { Boutique } from './pages/Boutique'
import { Photography } from './pages/Photography'
import { Gallery } from './pages/Gallery'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { DesignYourOwn } from './pages/DesignYourOwn'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { MyOrders } from './pages/customer/MyOrders'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminCustomOrders } from './pages/admin/AdminCustomOrders'
import { AdminYarnStock } from './pages/admin/AdminYarnStock'
import { AdminProducts } from './pages/admin/AdminProducts'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="boutique" element={<Boutique />} />
            <Route path="photography" element={<Photography />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route
              path="design"
              element={
                <ProtectedRoute role="customer">
                  <DesignYourOwn />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-orders"
              element={
                <ProtectedRoute role="customer">
                  <MyOrders />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminCustomOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="yarn" element={<AdminYarnStock />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
