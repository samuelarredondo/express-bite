/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ServiceProvider } from './presentation/di/ServiceContainer';
import { Header } from './presentation/components/common/Header';
import { ToastContainer } from './presentation/components/common/ToastContainer';
import { StudentView } from './presentation/components/student/StudentView';
import { StaffDashboard } from './presentation/components/staff/StaffDashboard';
import { CheckoutModal } from './presentation/components/checkout/CheckoutModal';
import { CleanArchitectureViewerModal } from './presentation/components/architecture/CleanArchitectureViewerModal';
import { useOrders } from './presentation/hooks/useOrders';
import { ProductDTO } from './core/application/dtos';

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'student' | 'staff'>('student');
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<ProductDTO | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

  const { orders, setActiveStudentOrderId } = useOrders();

  const handleInitiateCheckout = (product: ProductDTO) => {
    setSelectedProductForCheckout(product);
    setIsCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedProductForCheckout(null);
  };

  const handleTrackOrder = (orderId: string) => {
    setActiveStudentOrderId(orderId);
  };

  return (
    <div className="min-h-full flex flex-col font-sans text-slate-800 antialiased bg-slate-100">
      {/* Top Header Navigation */}
      <Header
        currentView={currentView}
        onSwitchView={setCurrentView}
        pendingCount={orders.length}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Views */}
      <main className="flex-1 overflow-y-auto">
        {currentView === 'student' ? (
          <StudentView onInitiateCheckout={handleInitiateCheckout} />
        ) : (
          <StaffDashboard />
        )}
      </main>

      {/* Checkout Modal & Payment Gateway Flow */}
      <CheckoutModal
        product={selectedProductForCheckout}
        isOpen={isCheckoutOpen}
        onClose={handleCloseCheckout}
        onTrackOrder={handleTrackOrder}
      />

      {/* Interactive Clean Architecture & SOLID Explorer */}
      <CleanArchitectureViewerModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ServiceProvider>
      <MainApp />
    </ServiceProvider>
  );
}
