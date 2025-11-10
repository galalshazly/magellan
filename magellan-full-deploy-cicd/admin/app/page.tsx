
'use client';
import axios from 'axios';
import { useState } from 'react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'otp'|'verify'>('otp');

  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';

  return (
    <div style={{ maxWidth: 360 }}>
      {step === 'otp' && (
        <form onSubmit={async (e)=>{ e.preventDefault(); await axios.post(base + '/auth/request-otp', { phone }); setStep('verify'); }}>
          <h3>تسجيل الدخول (OTP)</h3>
          <input placeholder="رقم الجوال" value={phone} onChange={e=>setPhone(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }}/>
          <button type="submit">إرسال رمز</button>
        </form>
      )}
      {step === 'verify' && (
        <form onSubmit={async (e)=>{ e.preventDefault(); const r = await axios.post(base + '/auth/verify-otp', { phone, code }); localStorage.setItem('token', r.data.token); location.href='/menu'; }}>
          <h3>أدخل الرمز</h3>
          <input placeholder="الرمز" value={code} onChange={e=>setCode(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }}/>
          <button type="submit">تحقق</button>
        </form>
      )}
    </div>
  );
}
