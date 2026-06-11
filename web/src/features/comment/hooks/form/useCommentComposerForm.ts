"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  commentComposerFormSchema,
  type CommentComposerFormValues,
} from "../../types/schemas/comment-composer-form.schema";

export function useCommentComposerForm() {
  return useForm<CommentComposerFormValues>({
    resolver: zodResolver(commentComposerFormSchema),
    defaultValues: {
      content: "",
      anonymity: true,
    },
  });
}
