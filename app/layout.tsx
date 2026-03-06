import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          background: "#edf2f7",
        }}
      >
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <aside
            style={{
              width: "240px",
              background: "#102542",
              color: "white",
              padding: "20px",
            }}
          >
            <h2 style={{ marginBottom: 6 }}>MIU EDU</h2>
            <div style={{ color: "#b8c7d9", fontSize: 13 }}>
              Hệ vận hành học tập
            </div>

            <nav style={{ marginTop: "30px" }}>
              <p>
                <Link href="/" style={{ color: "white", textDecoration: "none" }}>
                  Trang chủ
                </Link>
              </p>
              <p>
                <Link
                  href="/dashboard"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Dashboard
                </Link>
              </p>
              <p>
                <Link
                  href="/students"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Học sinh
                </Link>
              </p>
              <p>
                <Link
                  href="/homework-ai"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Chấm BTVN AI
                </Link>
              </p>
            </nav>
          </aside>

          <main style={{ flex: 1, padding: "40px", background: "#edf2f7" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
