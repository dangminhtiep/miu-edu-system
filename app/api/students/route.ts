export async function GET() {
  return Response.json([
    { id: 1, name: "Nguyễn Văn A", grade: "Lớp 8" },
    { id: 2, name: "Trần Thị B", grade: "Lớp 9" },
    { id: 3, name: "Lê Văn C", grade: "Lớp 7" },
  ]);
}