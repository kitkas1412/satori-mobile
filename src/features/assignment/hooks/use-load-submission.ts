import { useState } from "react";

import type { SubmitQuizResponse, SubmitWritingResponse } from "../api";
import { getQuizSubmissionApi, getWritingSubmissionApi } from "../api";

export function useLoadSubmission() {
  const [isLoading, setIsLoading] = useState(false);

  async function loadQuizSubmission(submissionId: string): Promise<SubmitQuizResponse> {
    setIsLoading(true);
    try {
      return await getQuizSubmissionApi(submissionId);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadWritingSubmission(submissionId: string): Promise<SubmitWritingResponse> {
    setIsLoading(true);
    try {
      return await getWritingSubmissionApi(submissionId);
    } finally {
      setIsLoading(false);
    }
  }

  return { loadQuizSubmission, loadWritingSubmission, isLoading };
}
