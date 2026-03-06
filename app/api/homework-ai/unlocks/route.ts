import { unlockOneMoreSubmission } from "@/lib/homework-ai/service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const unlock = await unlockOneMoreSubmission(formData);

    return Response.json(unlock, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Khong the mo khoa them lan nop.",
      },
      { status: 400 },
    );
  }
}
