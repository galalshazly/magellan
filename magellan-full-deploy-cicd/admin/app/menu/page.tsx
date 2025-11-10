
'use client';
import useSWR from 'swr';
import axios from 'axios';
import { useEffect, useState } from 'react';

const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function MenuPage() {
  const { data: categories, mutate: mutateCats } = useSWR(base + '/menu/categories', fetcher);
  const { data: items, mutate: mutateItems } = useSWR(base + '/menu/items', fetcher);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [price, setPrice] = useState(2500);

  useEffect(()=>{
    const t = localStorage.getItem('token');
    if (!t) location.href='/';
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + t;
  }, []);

  if (!categories || !items) return <div>Loading...</div>;

  return (
    <div>
      <h2>التصنيفات</h2>
      <ul>{categories.map((c:any)=> <li key={c.id}>{c.nameAr}</li>)}</ul>
      <h2>أضف صنف جديد</h2>
      <form onSubmit={async (e)=>{
        e.preventDefault();
        const catId = categories[0]?.id;
        await axios.post(base + '/admin/item', { nameAr, nameEn, basePrice: price, categoryId: catId });
        setNameAr(''); setNameEn(''); setPrice(2500); mutateItems();
      }}>
        <input placeholder="الاسم بالعربية" value={nameAr} onChange={e=>setNameAr(e.target.value)} />
        <input placeholder="الاسم بالإنجليزية" value={nameEn} onChange={e=>setNameEn(e.target.value)} />
        <input type="number" value={price} onChange={e=>setPrice(parseInt(e.target.value))} />
        <button type="submit">حفظ</button>
      </form>
      <h2>الأصناف</h2>
      <ul>{items.map((it:any)=> <li key={it.id}>{it.nameAr} - {it.basePrice/100} SAR</li>)}</ul>
    </div>
  );
}
