import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { HomeworkDatabase } from "@/lib/homework-ai/types";

const DATA_DIR = path.join(process.cwd(), "data", "homework-ai");
const DB_PATH = path.join(DATA_DIR, "database.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "homework-ai");

const EMPTY_DB: HomeworkDatabase = {
  assignments: [],
  submissions: [],
  complaints: [],
  unlocks: [],
};

async function ensureStore() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(UPLOAD_DIR, { recursive: true });
}

function normalizeDatabase(data: Partial<HomeworkDatabase> | undefined): HomeworkDatabase {
  return {
    assignments: data?.assignments ?? [],
    submissions: data?.submissions ?? [],
    complaints: data?.complaints ?? [],
    unlocks: data?.unlocks ?? [],
  };
}

export async function getUploadDir() {
  await ensureStore();
  return UPLOAD_DIR;
}

export async function readHomeworkDatabase(): Promise<HomeworkDatabase> {
  await ensureStore();

  try {
    const content = await readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(content) as Partial<HomeworkDatabase>;
    return normalizeDatabase(parsed);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeHomeworkDatabase(EMPTY_DB);
      return EMPTY_DB;
    }

    throw error;
  }
}

export async function writeHomeworkDatabase(data: HomeworkDatabase) {
  await ensureStore();
  await writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}
