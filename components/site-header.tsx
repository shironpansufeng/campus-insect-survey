import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

export async function SiteHeader() {
  const profile = await getCurrentProfile();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="site-nav">
          <Link className="site-brand" href="/">
            校园昆虫调查
          </Link>
          <Link href="/records">昆虫记录</Link>
          <Link href="/submit">上传记录</Link>
          {profile?.role === "teacher" ? <Link href="/review">审核管理</Link> : null}
        </div>

        <div className="site-nav__auth">
          {profile ? (
            <>
              <span>{profile.name || "已登录用户"}</span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login">登录</Link>
              <Link href="/register">注册</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
