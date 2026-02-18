import { describe, expect, it } from "vitest";

import { buildCreatePostFormData } from "./build-create-post-form-data";

async function readFormDataEntryAsText(
  entry: FormDataEntryValue
): Promise<string> {
  if (typeof entry === "string") return entry;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () =>
      reject(reader.error ?? new Error("FileReader error"));
    reader.readAsText(entry);
  });
}

describe("buildCreatePostFormData", () => {
  it("postData Blob에 title·text·anonymity가 JSON으로 들어간다", async () => {
    const formData = buildCreatePostFormData({
      title: "제목",
      content: "본문",
      anonymity: false,
      imageFiles: [],
    });

    const postDataRaw = formData.get("postData");
    expect(postDataRaw).not.toBeNull();

    const postData = JSON.parse(await readFormDataEntryAsText(postDataRaw!));
    expect(postData).toEqual({
      title: "제목",
      text: "본문",
      anonymity: false,
    });
  });
});
