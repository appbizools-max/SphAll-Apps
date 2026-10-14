import React, { useEffect, useState } from 'react';
import { AdminTotalRevenuePage } from '../../Admin/AnalyticsRevenue/AnalyticsRevenuePage';
import { receptionDataStore } from '../../../utils/receptionDataStore';

/**
 * Doctor Total Revenue Page
 * Connected directly to the centralized Live Revenue & Analytics Dashboard (http://localhost:3000/revenue)
 * Provides real-time Firestore sync across all transactions, ledger, and visual analytics.
 */
export const DoctorTotalRevenuePage: React.FC = () => {
  const [liveData, setLiveData] = useState<any[]>(() => {
    try {
      const pool = receptionDataStore.getAllCollectionsPool();
      if (pool && pool.length > 0) return pool;
      return receptionDataStore.getAppointments() || [];
    } catch (_) {
      return [];
    }
  });

  useEffect(() => {
    if (window.location.pathname !== '/revenue') {
      window.history.pushState({}, '', '/revenue');
    }

    try {
      receptionDataStore.startListeners();
    } catch (_) {}

    const unsub = receptionDataStore.subscribe((state) => {
      if (state.allCollectionsPool && state.allCollectionsPool.length > 0) {
        setLiveData(state.allCollectionsPool);
      } else if (state.appointments && state.appointments.length > 0) {
        setLiveData(state.appointments);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return <AdminTotalRevenuePage liveData={liveData} />;
};

export default DoctorTotalRevenuePage;
