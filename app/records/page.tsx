import { getApprovedRecords } from "@/lib/records";
import { RecordCard } from "@/components/record-card";

export default async function RecordsPage() {
  const records = await getApprovedRecords();

  return (
    <div className="stack">
      <div className="page-heading">
        <h1>昆虫记录列表</h1>
        <p>这里展示老师已经审核通过的校园昆虫观察记录。</p>
      </div>

      {records.length > 0 ? (
        <div className="record-grid">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <section className="panel">
          <p className="empty-state">还没有已审核通过的记录。</p>
        </section>
      )}
    </div>
  );
}
