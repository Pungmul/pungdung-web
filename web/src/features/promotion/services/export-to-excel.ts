import dayjs from "dayjs";

import type {
  PromotionApplicationDetail,
  PromotionDetail,
  PromotionQuestionStatistics,
} from "../types";

/** 엑셀 워크북 헤더·파일명에 쓰이는 최소 정보 */
export type PromotionExcelWorkbookMeta = Pick<
  PromotionDetail,
  "title" | "questions"
>;

/**
 * 엑셀 파일을 생성하고 다운로드합니다.
 */
export async function exportToExcel(
  responses: PromotionApplicationDetail[],
  statistics: PromotionQuestionStatistics[],
  workbookMeta: PromotionExcelWorkbookMeta
): Promise<void> {
  const { Workbook } = await import("exceljs");
  const workbook = new Workbook();

  // 시트 1: 신청자별 답변
  const responseSheet = workbook.addWorksheet("신청자별 답변");

  // 헤더 생성
  const headers = [
    "신청자 이메일",
    "신청자 닉네임",
    "제출일시",
    ...workbookMeta.questions
      .sort((a, b) => a.orderNo - b.orderNo)
      .map((q) => `Q${q.orderNo}. ${q.label}`),
  ];

  responseSheet.addRow(headers);

  // 헤더 스타일 적용
  const headerRow = responseSheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };

  // 데이터 추가
  responses.forEach((response) => {
    const row: (string | number)[] = [
      response.submitterUsername,
      response.submitterNickname,
      dayjs(response.submittedAt).format("YYYY-MM-DD HH:mm:ss"),
    ];

    // 질문 순서대로 답변 추가
    workbookMeta.questions
      .sort((a, b) => a.orderNo - b.orderNo)
      .forEach((question) => {
        const answer = response.answerList.find(
          (a) => a.questionId === question.id
        );

        if (!answer) {
          row.push("");
        } else if (question.questionType === "TEXT") {
          row.push(answer.answerText || "");
        } else {
          row.push(
            answer.selectedOptions?.map((opt) => opt.label).join(", ") || ""
          );
        }
      });

    responseSheet.addRow(row);
  });

  // 컬럼 너비 자동 조정
  for (let colIndex = 1; colIndex <= headers.length; colIndex++) {
    const column = responseSheet.getColumn(colIndex);
    let maxLength = 10;

    // 각 행을 순회하며 최대 길이 계산
    for (let rowIndex = 1; rowIndex <= responseSheet.rowCount; rowIndex++) {
      const cell = responseSheet.getCell(rowIndex, colIndex);
      if (cell.value) {
        const cellLength = cell.value.toString().length;
        maxLength = Math.max(maxLength, cellLength);
      }
    }

    // 헤더 길이도 고려
    const headerLength = headers[colIndex - 1]?.length || 10;
    maxLength = Math.max(maxLength, headerLength);

    // 최소 10, 최대 50으로 제한
    column.width = Math.min(Math.max(maxLength + 2, 10), 50);
  }

  // 시트 2: 통계
  const statisticsSheet = workbook.addWorksheet("통계");

  statistics.forEach((stat, index) => {
    // 질문 헤더
    const questionHeaderRow = statisticsSheet.addRow([
      `Q${stat.orderNo}. ${stat.questionLabel}`,
    ]);
    questionHeaderRow.font = { bold: true, size: 12 };
    questionHeaderRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD0D0D0" },
    };

    if (stat.questionType === "TEXT") {
      // 텍스트형 질문: 모든 답변 목록
      statisticsSheet.addRow(["답변"]);
      const answerHeaderRow = statisticsSheet.getRow(statisticsSheet.rowCount);
      answerHeaderRow.font = { bold: true };

      stat.textAnswers.forEach((text) => {
        statisticsSheet.addRow([text]);
      });

      statisticsSheet.addRow([`총 응답 수: ${stat.totalResponses}명`]);
      const totalRow = statisticsSheet.getRow(statisticsSheet.rowCount);
      totalRow.font = { bold: true };
    } else {
      // 선택형 질문: 옵션별 통계
      statisticsSheet.addRow(["옵션", "응답 수", "비율(%)"]);
      const optionHeaderRow = statisticsSheet.getRow(statisticsSheet.rowCount);
      optionHeaderRow.font = { bold: true };
      optionHeaderRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE8E8E8" },
      };

      stat.optionStatistics.forEach((optStat) => {
        statisticsSheet.addRow([
          optStat.optionLabel,
          optStat.count,
          `${optStat.percentage}%`,
        ]);
      });

      statisticsSheet.addRow([`총 응답 수: ${stat.totalResponses}명`]);
      const totalRow = statisticsSheet.getRow(statisticsSheet.rowCount);
      totalRow.font = { bold: true };
    }

    // 질문 간 간격
    if (index < statistics.length - 1) {
      statisticsSheet.addRow([]);
    }
  });

  // 통계 시트 컬럼 너비 조정
  // 통계 시트는 최대 3개 컬럼 (옵션, 응답 수, 비율)
  const maxColumns = 3;
  for (let colIndex = 1; colIndex <= maxColumns; colIndex++) {
    const column = statisticsSheet.getColumn(colIndex);
    let maxLength = 10;

    // 각 행을 순회하며 최대 길이 계산
    for (let rowIndex = 1; rowIndex <= statisticsSheet.rowCount; rowIndex++) {
      const cell = statisticsSheet.getCell(rowIndex, colIndex);
      if (cell.value) {
        const cellLength = cell.value.toString().length;
        maxLength = Math.max(maxLength, cellLength);
      }
    }

    // 최소 10, 최대 50으로 제한
    column.width = Math.min(Math.max(maxLength + 2, 10), 50);
  }

  // 파일 다운로드
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${workbookMeta.title}_통계_${dayjs().format(
    "YYYY-MM-DD_HH-mm-ss"
  )}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
