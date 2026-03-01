export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>

          {/* Sidebar */}
          <aside
            style={{
              width: "240px",
              background: "#111827",
              color: "white",
              padding: "20px",
            }}
          >
            <h2>MIU EDU</h2>

            <nav style={{ marginTop: "30px" }}>
              <p><a href="/dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</a></p>
              <p><a href="/students" style={{ color: "white", textDecoration: "none" }}>Học sinh</a></p>
            </nav>
          </aside>

          {/* Main Content */}
          <main style={{ flex: 1, padding: "40px", background: "#f3f4f6" }}>
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}