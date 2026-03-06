import { createHomeworkAssignment } from "@/lib/homework-ai/service";
import { readHomeworkDatabase } from "@/lib/homework-ai/store";

export const runtime = "nodejs";

export async function GET() {
  const database = await readHomeworkDatabase();
  return Response.json(database.assignments);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const assignment = await createHomeworkAssignment(formData);

    return Response.json(assignment, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Khong the tao bai giao.",
      },
      { status: 400 },
    );
  }
}
