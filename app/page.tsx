import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/env";

export default function HomePage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="stack">
      <section className="hero">
        <div className="page-heading">
          <h1>校园昆虫调查</h1>
          <p>
            这是一个面向校园观察活动的轻量网站。学生可以上传昆虫观察记录，老师审核通过后，记录会展示在公开列表中。
          </p>
        </div>

        <div className="hero__actions">
          <Link href="/records" className="button">
            查看昆虫记录
          </Link>
          <Link href="/submit" className="button button--secondary">
            上传我的记录
          </Link>
        </div>
      </section>

      {!configured ? (
        <section className="panel">
          <h2>下一步先配置 Supabase</h2>
          <p>
            现在网页能打开，说明 Next.js 已经跑起来了。接下来只差把 Supabase
            项目的地址和匿名密钥填进环境变量，登录、上传和审核功能才能工作。
          </p>
          <div className="record-meta">
            <span>1. 在项目根目录创建 `.env.local` 文件</span>
            <span>
              2. 填入 `NEXT_PUBLIC_SUPABASE_URL` 和
              `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            </span>
            <span>3. 重启本地开发服务器</span>
          </div>
        </section>
      ) : null}

      <section className="grid grid--two">
        <article className="panel">
          <h2>项目目标</h2>
          <p>
            记录校园中常见的昆虫种类、地点和生境，积累基础生态观察数据，也帮助学生形成持续观察和规范记录的习惯。
          </p>
        </article>

        <article className="panel">
          <h2>记录流程</h2>
          <p>
            学生登录后填写记录表单并上传照片，系统会把记录标记为待审核。老师审核通过后，这条记录才会出现在公开列表页。
          </p>
        </article>
      </section>

      <section className="kpi-list">
        <div className="kpi">
          <strong>步骤 1</strong>
          <p>注册或登录账号</p>
        </div>
        <div className="kpi">
          <strong>步骤 2</strong>
          <p>填写昆虫观察信息并上传照片</p>
        </div>
        <div className="kpi">
          <strong>步骤 3</strong>
          <p>等待老师审核，通过后公开展示</p>
        </div>
      </section>
    </div>
  );
}
