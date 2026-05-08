# 校园昆虫调查网站 MVP

这是一个基于 Next.js + Supabase + Vercel 的入门项目，适合先完成最小可用版本：

- 首页介绍项目
- 公开展示已审核通过的昆虫记录
- 登录/注册
- 学生上传记录
- 老师审核记录

## 1. 先准备什么

你需要先准备：

- 一个 Supabase 项目
- 一个 Vercel 账号
- 一个能安装 Node 包的环境

当前仓库已经包含页面和逻辑代码，但本机环境里还没有 `npm` / `pnpm` / `yarn`，所以依赖还没安装。

## 2. 环境变量

复制 `.env.example` 为 `.env.local`，并填入：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase 项目地址
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase 匿名 key
```

## 3. 创建数据库

到 Supabase 控制台的 SQL Editor 中执行：

[`supabase/schema.sql`](/Users/scofield/Documents/New%20project/supabase/schema.sql)

这个脚本会完成：

- 创建 `profiles` 表
- 创建 `insect_records` 表
- 创建新用户自动生成 `profiles` 的触发器
- 开启 RLS 权限规则
- 创建图片存储桶 `record-images`

## 4. 安装依赖并运行

等你的环境里有包管理器后，在项目根目录运行：

```bash
npm install
npm run dev
```

如果你用 `pnpm` 或 `yarn`，把命令替换掉就可以。

## 5. 老师账号怎么设置

MVP 里新注册用户默认都是 `student`。

如果你想把某个账号改成老师，到 Supabase 里执行类似 SQL：

```sql
update public.profiles
set role = 'teacher'
where id = '对应用户的 uuid';
```
