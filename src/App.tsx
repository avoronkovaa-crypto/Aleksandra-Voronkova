import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { Header } from './components/header/Header'
import { CartDrawer } from './components/cart/CartDrawer'
import { Home } from './pages/Home'
import { Cases } from './pages/Cases'
import { CasesPopAir } from './pages/CasesPopAir'
import { PopSeries } from './pages/PopSeries'
import { PopAirLanding } from './pages/PopAirLanding'
import { ProductPage } from './pages/ProductPage'
import { Delivery } from './pages/checkout/Delivery'
import { Payment } from './pages/checkout/Payment'
import { OrderConfirmed } from './pages/checkout/OrderConfirmed'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // wait for the exit transition before jumping to top
    const t = window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }), 200)
    return () => window.clearTimeout(t)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <ScrollToTop />
      <Header />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/cases/pop-air" element={<CasesPopAir />} />
          <Route path="/pop-series" element={<PopSeries />} />
          <Route path="/pop-air" element={<PopAirLanding />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout/delivery" element={<Delivery />} />
          <Route path="/checkout/payment" element={<Payment />} />
          <Route path="/checkout/confirmed" element={<OrderConfirmed />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
      <CartDrawer />
    </>
  )
}
