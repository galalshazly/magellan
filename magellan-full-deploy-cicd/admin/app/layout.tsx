
export const metadata = { title: 'Magellan Admin' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: 'sans-serif', margin: 0 }}>
        <div style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
          <b>Magellan Admin</b>
          <a href="/menu">القائمة</a>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </body>
    </html>
  );
}
