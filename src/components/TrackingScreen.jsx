import React, { useState } from 'react';
import axios from 'axios';

export default function TrackingScreen({ token, onBack }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShipment(null);

    try {
      const response = await axios.get(`http://localhost:8000/api/shipments/track/${trackingNumber}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShipment(response.data);
    } catch (err) {
      setError('لم يتم العثور على شحنة بهذا الرقم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ color: '#fff', padding: '20px', direction: 'rtl' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1e293b', padding: '30px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#3b82f6', margin: 0 }}>🔍 تتبع مسار الشحنة</h2>
          {onBack && <button onClick={onBack} style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>رجوع</button>}
        </div>

        <form onSubmit={handleTrack} style={{ display: 'grid', gap: '15px' }}>
          <input 
            type="text" 
            value={trackingNumber} 
            onChange={(e) => setTrackingNumber(e.target.value)} 
            required 
            placeholder="أدخل رقم التتبع (مثال: AIR-123456)" 
            style={{ width: '100%', padding: '12px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '8px', boxSizing: 'border-box' }} 
          />
          <button type="submit" disabled={loading} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'جاري البحث...' : 'تتبع'}
          </button>
        </form>

        {error && <p style={{ color: '#ef4444', marginTop: '15px', textAlign: 'center' }}>{error}</p>}

        {shipment && (
          <div style={{ marginTop: '25px', background: '#0f172a', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
            <h3 style={{ color: '#10b981', marginTop: 0 }}>📦 حالة الشحنة الحالية</h3>
            <p><strong>رقم التتبع:</strong> {shipment.tracking_number}</p>
            <p><strong>الوجهة / المسار:</strong> {shipment.destination}</p>
            <p><strong>الحالة:</strong> <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{shipment.status}</span></p>
            <p style={{ color: '#94a3b8' }}><strong>التفاصيل:</strong> {shipment.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}