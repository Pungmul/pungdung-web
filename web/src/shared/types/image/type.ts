export interface ImageObject {
  id: number; // 프로필 이미지의 고유 ID
  originalFilename: string; // 원본 파일명
  convertedFileName: string; // 변환된 파일명 경로
  fullFilePath: string; // 전체 파일 경로 (S3 URL)
  fileType: string; // 파일 타입 (예: image/jpeg)
  fileSize: number | null; // 파일 크기 (바이트 단위, 미집계 시 null)
  createdAt: string; // 파일 생성일 (ISO 형식)
} 