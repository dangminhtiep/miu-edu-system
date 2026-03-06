export default function Home() {
  return (
    <div
      style={{
        display: "grid",
        gap: 24,
      }}
    >
      <section
        style={{
          borderRadius: 28,
          padding: 32,
          background:
            "linear-gradient(135deg, #f6efe5 0%, #d8e9f3 44%, #f3f8fb 100%)",
          border: "1px solid #d7dee7",
        }}
      >
        <div style={{ maxWidth: 760 }}>
          <div
            style={{
              display: "inline-flex",
              background: "#102542",
              color: "#ffffff",
              padding: "6px 12px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 12,
              marginBottom: 16,
            }}
          >
            MIU Web
          </div>
          <h1
            style={{
              fontSize: 42,
              lineHeight: 1.1,
              margin: "0 0 12px",
              color: "#102542",
            }}
          >
            Bản vận hành sớm cho chấm bài tập về nhà bằng AI
          </h1>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: "#324154",
              margin: "0 0 20px",
            }}
          >
            Repo hiện đang ưu tiên một `vertical slice (lát cắt dọc)` có thể dùng
            sớm cho học sinh thật: nộp ảnh bài tập, chấm bằng AI và lưu kết quả có
            thể truy vết.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a
              href="/homework-ai"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 220,
                padding: "14px 18px",
                borderRadius: 16,
                background: "#102542",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Mở workspace chấm BTVN AI
            </a>
            <a
              href="/students"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 180,
                padding: "14px 18px",
                borderRadius: 16,
                border: "1px solid #102542",
                color: "#102542",
                textDecoration: "none",
                fontWeight: 700,
                background: "rgba(255,255,255,0.6)",
              }}
            >
              Xem danh sách học sinh
            </a>
          </div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 18,
        }}
      >
        {[
          {
            title: "Input thật",
            body: "Học sinh nộp ảnh bài làm thay vì chỉ nhập văn bản.",
          },
          {
            title: "AI-agnostic",
            body: "Tách `provider adapter (lớp thích ứng nhà cung cấp)` để thay Gemini sau này.",
          },
          {
            title: "Có truy vết",
            body: "Lưu `model`, `prompt version`, `confidence` và cờ rà soát.",
          },
        ].map((card) => (
          <article
            key={card.title}
            style={{
              background: "#ffffff",
              borderRadius: 20,
              padding: 22,
              border: "1px solid #d7dee7",
            }}
          >
            <h2 style={{ margin: "0 0 10px", color: "#102542" }}>
              {card.title}
            </h2>
            <p style={{ margin: 0, lineHeight: 1.6, color: "#4a5565" }}>
              {card.body}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
