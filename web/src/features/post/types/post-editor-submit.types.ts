/** 작성/수정 제출 단계별 UI 상태(이미지 multipart 업로드 진행 표시용). */
export type PostEditorSubmitUploadUi =
  | { phase: "idle" }
  | {
      phase: "compressing";
      current: number;
      total: number;
      percent: number;
    }
  | {
      phase: "uploading";
      indeterminate: boolean;
      percent?: number;
      /** 업로드 남은 시간 추정치(초). 알 수 없으면 null. */
      remainingSeconds?: number | null;
    }
  | { phase: "saving" };
