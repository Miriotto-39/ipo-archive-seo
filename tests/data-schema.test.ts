import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { IpoRecord, Market } from "../src/lib/types";

const markets: Market[] = [
  "プライム",
  "スタンダード",
  "グロース",
  "TOKYO PRO",
  "名証",
  "福証",
  "札証",
  "旧マザーズ",
  "旧JASDAQ"
];

function isNumberOrUndefined(value: unknown): boolean {
  return value === undefined || typeof value === "number";
}

function assertIpoRecord(value: unknown): asserts value is IpoRecord {
  expect(value).toBeTypeOf("object");
  const record = value as Partial<IpoRecord>;
  expect(record.code).toMatch(/^\d{4}$/);
  expect(record.name).toBeTypeOf("string");
  expect(record.listing_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(markets).toContain(record.market);
  expect(record.business).toBeTypeOf("string");
  expect(Array.isArray(record.source_urls)).toBe(true);
  expect(record.updated_at).toBeTypeOf("string");
  expect(isNumberOrUndefined(record.issue_price)).toBe(true);
  expect(isNumberOrUndefined(record.initial_price)).toBe(true);
  expect(isNumberOrUndefined(record.initial_return_pct)).toBe(true);
}

describe("data/ipo.jsonl", () => {
  const filePath = join(process.cwd(), "data", "ipo.jsonl");
  const records = readFileSync(filePath, "utf-8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line) as unknown);

  it("contains the phase 1 sample records", () => {
    expect(records).toHaveLength(10);
  });

  it("matches the IpoRecord shape", () => {
    for (const record of records) {
      assertIpoRecord(record);
    }
  });
});
