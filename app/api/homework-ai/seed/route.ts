import { seedHomeworkAiMockData } from "@/lib/homework-ai/service";

export const runtime = "nodejs";

export async function POST() {
  try {
    const seeded = await seedHomeworkAiMockData();
    return Response.json(seeded, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Khong the tao du lieu test.",
      },
      { status: 400 },
    );
  }
}
