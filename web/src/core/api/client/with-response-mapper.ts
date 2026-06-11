import { ClientApiError } from "./client-api-error";
import { ClientMapperError } from "./client-mapper-error";

/**
 * `clientApiRequest`로 DTO를 받은 뒤 도메인/화면 모델로 변환할 때 사용한다.
 * - HTTP·envelope·스키마 오류: `ClientApiError`로 그대로 전달
 * - 매퍼(필드 변환) 오류: `ClientMapperError`로 감싼다
 */
export async function withResponseMapper<TDto, TModel>(options: {
  context: string;
  fetchDto: () => Promise<TDto>;
  map: (dto: TDto) => TModel;
}): Promise<TModel> {
  try {
    const dto = await options.fetchDto();
    return options.map(dto);
  } catch (error) {
    if (error instanceof ClientApiError) {
      throw error;
    }
    throw new ClientMapperError({
      message: "응답을 앱 모델로 변환하는 데 실패했습니다.",
      context: options.context,
      cause: error,
    });
  }
}
