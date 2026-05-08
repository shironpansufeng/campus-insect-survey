import type { InsectRecord } from "@/types";

type RecordCardProps = {
  record: InsectRecord;
};

export function RecordCard({ record }: RecordCardProps) {
  return (
    <article className="record-card">
      {record.image_url ? (
        <img
          className="record-card__image"
          src={record.image_url}
          alt={record.insect_name}
        />
      ) : (
        <div className="record-card__image" />
      )}

      <div className="record-card__body">
        <div>
          <span className="status-badge">已审核通过</span>
          <h3>{record.insect_name}</h3>
        </div>

        <div className="record-meta">
          <span>地点：{record.location}</span>
          <span>生境：{record.habitat}</span>
          <span>观察日期：{record.observed_at}</span>
          <span>数量：{record.count}</span>
        </div>

        {record.note ? <p>{record.note}</p> : null}
      </div>
    </article>
  );
}
