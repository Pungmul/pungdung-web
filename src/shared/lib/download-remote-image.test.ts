import { describe, expect, it } from "vitest";

import { downloadRemoteImageUtils } from "./download-remote-image";

describe("downloadRemoteImageUtils", () => {
  it("cross-origin URL은 Next image proxy로 변환한다", () => {
    const imageUrl =
      "https://pungmul-s3-bucket.s3.ap-northeast-2.amazonaws.com/a.jpg";

    expect(
      downloadRemoteImageUtils.buildImageFetchUrl(imageUrl)
    ).toBe(
      `/_next/image?url=${encodeURIComponent(imageUrl)}&w=3840&q=100`
    );
  });

  it("확장자가 없는 파일명에 mime type을 반영한다", () => {
    expect(
      downloadRemoteImageUtils.resolveFilename("image-1", "image/webp")
    ).toBe("image-1.webp");
    expect(
      downloadRemoteImageUtils.resolveFilename("photo.jpg", "image/jpeg")
    ).toBe("photo.jpg");
  });
});
