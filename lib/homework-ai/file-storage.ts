import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import { getUploadDir } from "@/lib/homework-ai/store";
import type { HomeworkFileRecord } from "@/lib/homework-ai/types";

export interface HomeworkFileStorage {
  persistFiles(
    files: File[],
    entityId: string,
    category: "assignment" | "submission",
    allowedMimeTypes: Set<string>,
  ): Promise<HomeworkFileRecord[]>;
}

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

class LocalHomeworkFileStorage implements HomeworkFileStorage {
  async persistFiles(
    files: File[],
    entityId: string,
    category: "assignment" | "submission",
    allowedMimeTypes: Set<string>,
  ) {
    const uploadDir = await getUploadDir();

    return Promise.all(
      files.map(async (file, index) => {
        if (!allowedMimeTypes.has(file.type)) {
          throw new Error("Tep tai len khong dung dinh dang cho phep.");
        }

        const ext =
          path.extname(file.name) ||
          (file.type === "application/pdf"
            ? ".pdf"
            : file.type === "image/png"
              ? ".png"
              : ".jpg");

        const filename = `${category}-${entityId}-${index + 1}-${sanitizeFilename(
          file.name || `file${ext}`,
        )}`;
        const targetPath = path.join(uploadDir, filename);
        const buffer = Buffer.from(await file.arrayBuffer());

        await writeFile(targetPath, buffer);

        return {
          id: randomUUID(),
          filename,
          mimeType: file.type,
          base64Data: buffer.toString("base64"),
          publicUrl: `/uploads/homework-ai/${filename}`,
        } satisfies HomeworkFileRecord;
      }),
    );
  }
}

const storage = new LocalHomeworkFileStorage();

export function getHomeworkFileStorage(): HomeworkFileStorage {
  return storage;
}
