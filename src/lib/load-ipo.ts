import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { IpoRecord } from "./types";

export async function loadIpos(): Promise<IpoRecord[]> {
  const filePath = join(process.cwd(), "data", "ipo.jsonl");
  const raw = await readFile(filePath, "utf-8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as IpoRecord)
    .sort((a, b) => b.listing_date.localeCompare(a.listing_date));
}

export async function getIpoByCode(code: string): Promise<IpoRecord | undefined> {
  const ipos = await loadIpos();
  return ipos.find((ipo) => ipo.code === code);
}
