"use client";

import React from "react";

import { useFormContext, useWatch } from "react-hook-form";

import { EditorState } from "draft-js";

import type { PostEditorFormValues } from "../../types/schemas";

interface PostingRuleTextProps {
  editorState: EditorState;
}

export function PostingRuleText({ editorState }: PostingRuleTextProps) {
  const { control } = useFormContext<PostEditorFormValues>();
  const imageFiles = useWatch({ control, name: "imageFiles" }) ?? [];

  return (
    editorState.getCurrentContent().getBlockMap().size < 5 &&
    editorState.getCurrentContent().getPlainText().length < 200 &&
    imageFiles.length === 0 && (
      <div className="bottom-32 select-none px-[12px]">
        <div className="text-left relative text-grey-500">
          <div>
            <div>
              <div className="font-medium text-xl">
                게시글 작성 안내
              </div>
              <div className="font-light text-sm">
                게시판 이용 시 아래 내용을 반드시 숙지해 주시기 바랍니다.
              </div>
            </div>
            <br />
            <ol className="list-decimal pl-6 font-medium">
              <li>
                피해 발생 시 책임
                <div className="font-light text-sm">
                  게시판에 게시된 글로 인해 발생하는 피해는 글 작성자 본인에게
                  책임이 있습니다. 글 작성 시 신중히 작성해 주시기 바랍니다.
                </div>
                <br />
              </li>
              <li>
                명예훼손 및 불법 행위 금지
                <div className="font-light text-sm">
                  타인의 명예를 훼손하거나 법적으로 문제가 될 수 있는 내용을
                  포함한 게시글은 엄격히 금지됩니다. 해당 글은 사전 통보 없이
                  삭제될 수 있으며, 필요한 경우 법적 조치를 취할 수 있습니다.
                </div>
                <br />
              </li>
              <li>
                개인정보 보호
                <div className="font-light text-sm">
                  게시글에 개인 정보(연락처, 주소 등)를 포함하지 않도록 주의해
                  주시기 바랍니다.
                </div>
                <br />
              </li>
              <li>
                문의 및 신고
                <div className="font-light text-sm">
                  게시판 이용과 관련하여 궁금한 사항이 있거나 문제를 발견하신
                  경우, 관리자에게 문의해 주시기 바랍니다.
                </div>
                <br />
              </li>
            </ol>

            <div className="font-light text-sm">
              이용자 여러분의 협조를 부탁드립니다.
            </div>
          </div>
        </div>
      </div>
    )
  );
}
