import { createHomeworkComplaint } from "@/lib/homework-ai/service";
import { readHomeworkDatabase } from "@/lib/homework-ai/store";

export const runtime = "nodejs";

export async function GET() {
  const database = await readHomeworkDatabase();
  return Response.json(database.complaints);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const complaint = await createHomeworkComplaint(formData);

    return Response.json(complaint, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Khong the gui khieu nai.",
      },
      { status: 400 },
    );
  }
}
