// 작성/수정 제출 단계별 UI 상태
export type PostEditorSubmitUploadUi =
  | { phase: "idle" }
  | {
      phase: "compressing";
      current: number;
      total: number;
      percent: number;
    }
  | { phase: "uploading" };
