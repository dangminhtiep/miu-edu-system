import { submitHomeworkForAiGrading } from "@/lib/homework-ai/service";
import { readHomeworkDatabase } from "@/lib/homework-ai/store";

export const runtime = "nodejs";

export async function GET() {
  const database = await readHomeworkDatabase();
  return Response.json(database.submissions);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const submission = await submitHomeworkForAiGrading(formData);

    return Response.json(submission, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Khong the xu ly bai nop.",
      },
      { status: 400 },
    );
  }
}
