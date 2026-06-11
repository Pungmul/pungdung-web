import { convertFromRaw, EditorState } from "draft-js";

/** 단일 unstyled 블록으로 Plain 텍스트를 Draft `EditorState`로 만든다. */
export function postEditorStateFromPlainText(
  text: string,
  blockKey: string
): EditorState {
  return EditorState.createWithContent(
    convertFromRaw({
      entityMap: {},
      blocks: [
        {
          text,
          key: blockKey,
          type: "unstyled",
          entityRanges: [],
          depth: 0,
          inlineStyleRanges: [],
        },
      ],
    })
  );
}
