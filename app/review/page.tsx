import { requireTeacher } from "@/lib/auth";
import { getPendingRecords } from "@/lib/records";
import { ReviewActions } from "@/app/review/review-actions";

export default async function ReviewPage() {
  await requireTeacher();
  const records = await getPendingRecords();

  return (
    <div className="stack">
      <div className="page-heading">
        <h1>待审核记录</h1>
        <p>老师可以在这里查看学生提交的记录，并决定是否公开展示。</p>
      </div>

      {records.length > 0 ? (
        <section className="table-like">
          {records.map((record) => (
            <article className="review-item" key={record.id}>
              <div className="review-item__top">
                {record.image_url ? (
                  <img
                    className="review-item__image"
                    src={record.image_url}
                    alt={record.insect_name}
                  />
                ) : (
                  <div className="review-item__image" />
                )}

                <div className="stack">
                  <div>
                    <span className="status-badge">待审核</span>
                    <h2>{record.insect_name}</h2>
                  </div>
                  <div className="record-meta">
                    <span>上传人：{record.uploader?.name || "未命名用户"}</span>
                    <span>地点：{record.location}</span>
                    <span>生境：{record.habitat}</span>
                    <span>数量：{record.count}</span>
                    <span>观察日期：{record.observed_at}</span>
                  </div>
                  {record.note ? <p>备注：{record.note}</p> : null}
                </div>
              </div>

              <ReviewActions recordId={record.id} />
            </article>
          ))}
        </section>
      ) : (
        <section className="panel">
          <p className="empty-state">当前没有待审核记录。</p>
        </section>
      )}
    </div>
  );
}
