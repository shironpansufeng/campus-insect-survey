"use client";

import { useTransition } from "react";
import { reviewRecord } from "@/app/review/actions";

type ReviewActionsProps = {
  recordId: string;
};

export function ReviewActions({ recordId }: ReviewActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleReview = (nextStatus: "approved" | "rejected") => {
    startTransition(async () => {
      await reviewRecord(recordId, nextStatus);
    });
  };

  return (
    <div className="button-row">
      <button type="button" disabled={isPending} onClick={() => handleReview("approved")}>
        {isPending ? "处理中..." : "通过"}
      </button>
      <button
        type="button"
        className="button--danger"
        disabled={isPending}
        onClick={() => handleReview("rejected")}
      >
        拒绝
      </button>
    </div>
  );
}
