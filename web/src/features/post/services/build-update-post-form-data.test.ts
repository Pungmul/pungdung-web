import { describe, expect, it } from "vitest";

import { buildUpdatePostFormData } from "./build-update-post-form-data";

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

describe("buildUpdatePostFormData", () => {
  it("id가 -1인 이미지만 새 파일로 append하고 삭제 id 목록을 postData에 넣는다", async () => {
    const existing1 = new Blob([new Uint8Array([1])]);
    const existing2 = new Blob([new Uint8Array([2])]);
    const fresh = new Blob([new Uint8Array([3])]);

    const formData = buildUpdatePostFormData({
      title: "t",
      content: "c",
      anonymity: true,
      prevImageIdList: [10, 20, 30],
      imageFiles: [
        { id: 10, blob: existing1 },
        { id: -1, blob: fresh },
        { id: 30, blob: existing2 },
      ],
    });

    const postDataRaw = formData.get("postData");
    expect(postDataRaw).not.toBeNull();

    const postData = JSON.parse(await readFormDataEntryAsText(postDataRaw!));
    expect(postData.deleteImageIdList).toEqual([20]);

    const filesKeys = [...formData.getAll("files")];
    expect(filesKeys).toHaveLength(1);
    const appended = filesKeys[0];
    expect(appended).toBeInstanceOf(File);
    expect((appended as File).name).toBe("post-image-0.jpg");
  });

  it("추가 이미지가 없어도 files 필드에는 빈 Blob이 붙는다", async () => {
    const formData = buildUpdatePostFormData({
      title: "t",
      content: "c",
      anonymity: false,
      prevImageIdList: [1],
      imageFiles: [{ id: 1, blob: new Blob([]) }],
    });

    const files = formData.getAll("files");
    expect(files).toHaveLength(1);
    expect(files[0]).toBeInstanceOf(Blob);
    expect((files[0] as Blob).size).toBe(0);
  });
});
