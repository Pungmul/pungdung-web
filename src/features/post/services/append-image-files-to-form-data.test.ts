import { describe, expect, it } from "vitest";

import { appendImageFilesToFormData } from "./append-image-files-to-form-data";

async function readFilesEntries(formData: FormData) {
  const out: { blob: Blob }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key !== "files") continue;
    out.push({ blob: value as Blob });
  }
  return out;
}

describe("appendImageFilesToFormData", () => {
  it("이미지가 없으면 files에 빈 Blob을 붙인다", async () => {
    const formData = new FormData();
    appendImageFilesToFormData(formData, []);

    const files = await readFilesEntries(formData);
    expect(files).toHaveLength(1);
    expect(files[0]!.blob).toBeInstanceOf(Blob);
    expect(files[0]!.blob.size).toBe(0);
  });

  it("Blob 항목은 File로 변환해 index 기반 이름으로 append한다", async () => {
    const formData = new FormData();
    const png = new Blob([new Uint8Array([1, 2])], { type: "image/png" });
    appendImageFilesToFormData(formData, [{ blob: png }]);

    const files = await readFilesEntries(formData);
    expect(files).toHaveLength(1);
    const body = files[0]!.blob;
    expect(body).toBeInstanceOf(File);
    expect((body as File).name).toBe("post-image-0.jpg");
    expect((body as File).type).toBe("image/png");
  });

  it("File 입력은 그대로 append한다", async () => {
    const formData = new FormData();
    const file = new File([new Uint8Array([9])], "keep-name.png", {
      type: "image/png",
    });
    appendImageFilesToFormData(formData, [{ blob: file }]);

    const files = await readFilesEntries(formData);
    expect(files).toHaveLength(1);
    expect(files[0]!.blob).toBe(file);
  });
});
