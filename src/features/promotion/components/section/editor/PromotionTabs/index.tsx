"use client";

import { useCallback } from "react";

import type { Editor as EditorType } from "@toast-ui/react-editor";
import { AnimatePresence } from "framer-motion";
import { useFormContext } from "react-hook-form";

import { Conditional } from "@/shared/components/Conditional";

import { PromotionDescriptionEditor } from "./PromotionDescriptionEditor";
import { PromotionTabNav } from "./PromotionTabNav";
import type { PromotionPostingFormValues } from "../../../../types/promotion-posting-form.types";
import {
  type PromotionPostingEditorTab,
  usePromotionPostingEditorTabs,
} from "../../../../hooks/view-model/usePromotionPostingEditorTabs";
import { QuestionContentSection } from "../QuestionContentSection";

export type PromotionTabsProps = {
  descriptionEditorRef: React.RefObject<EditorType | null>;
};

export const PromotionTabs = ({
  descriptionEditorRef,
}: PromotionTabsProps) => {
  const { setValue } = useFormContext<PromotionPostingFormValues>();
  // 소개·설문 탭 전환 + 탭 헤더로 스크롤
  const {
    tabDefinitions,
    selectedTab,
    handleTabChange: selectTabAndScroll,
    tabsSectionRef,
  } = usePromotionPostingEditorTabs();

  const handleTabChange = useCallback(
    (tab: PromotionPostingEditorTab) => {
      if (
        selectedTab.value === "description" &&
        tab.value !== "description"
      ) {
        const inst = descriptionEditorRef.current?.getInstance();
        if (inst) {
          setValue("descriptionSeed", inst.getMarkdown(), {
            shouldDirty: true,
          });
        }
      }
      selectTabAndScroll(tab);
    },
    [descriptionEditorRef, selectTabAndScroll, selectedTab.value, setValue]
  );

  return (
    <section
      ref={tabsSectionRef}
      className="relative w-full max-w-[640px] min-w-[320px] mx-auto"
    >
      <AnimatePresence key="promotion-tabs-animate-presence">
        <PromotionTabNav
          key="promotion-tabs-nav"
          tabs={[...tabDefinitions]}
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
        />
        <main
          key="promotion-tabs-main"
          className="w-full flex flex-col gap-[12px] py-[12px] min-h-[320px] h-full"
        >
          <Conditional
            value={selectedTab.value}
            cases={{
              description: (
                <section className="relative w-full h-[480px] z-0">
                  <PromotionDescriptionEditor editorRef={descriptionEditorRef} />
                </section>
              ),
              question: <QuestionContentSection />,
            }}
          />
        </main>
      </AnimatePresence>
    </section>
  );
};
