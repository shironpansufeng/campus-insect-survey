"use client";

import { useActionState } from "react";
import { submitRecord } from "@/app/submit/actions";

const initialState = {
  error: "",
  success: "",
};

export function SubmitForm() {
  const [state, formAction, isPending] = useActionState(
    async (_previousState: typeof initialState, formData: FormData) => {
      const result = await submitRecord(formData);

      return {
        error: result?.error ?? "",
        success: result?.success ?? "",
      };
    },
    initialState,
  );

  return (
    <section className="form-card">
      <h1>上传昆虫记录</h1>
      <p className="hint">请尽量填写完整信息，提交后老师审核通过才会公开显示。</p>

      <form action={formAction} className="field-list">
        <div className="field">
          <label htmlFor="insect_name">昆虫名称</label>
          <input id="insect_name" name="insect_name" required />
        </div>

        <div className="field">
          <label htmlFor="location">地点</label>
          <input id="location" name="location" required />
        </div>

        <div className="field">
          <label htmlFor="habitat">生境</label>
          <input id="habitat" name="habitat" required />
        </div>

        <div className="field">
          <label htmlFor="count">数量</label>
          <input id="count" name="count" type="number" min="1" required />
        </div>

        <div className="field">
          <label htmlFor="observed_at">观察日期</label>
          <input id="observed_at" name="observed_at" type="date" required />
        </div>

        <div className="field">
          <label htmlFor="note">备注</label>
          <textarea id="note" name="note" placeholder="可填写补充说明，例如天气、行为、数量估计方式等。" />
        </div>

        <div className="field">
          <label htmlFor="image">图片上传</label>
          <input id="image" name="image" type="file" accept="image/*" required />
        </div>

        {state.error ? <p className="form-message">{state.error}</p> : null}
        {state.success ? <p className="form-message">{state.success}</p> : null}

        <button type="submit" disabled={isPending}>
          {isPending ? "提交中..." : "提交记录"}
        </button>
      </form>
    </section>
  );
}
