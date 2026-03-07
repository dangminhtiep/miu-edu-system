import { createTeacherReview } from "@/lib/homework-ai/service";
import { readHomeworkDatabase } from "@/lib/homework-ai/store";

export const runtime = "nodejs";

export async function GET() {
  const database = await readHomeworkDatabase();
  return Response.json(database.reviews);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const review = await createTeacherReview(formData);

    return Response.json(review, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Khong the luu ket qua ra soat.",
      },
      { status: 400 },
    );
  }
}
