import { mockStudents } from "@/lib/students/mock";

export async function GET() {
  return Response.json(mockStudents);
}
