import { requireUser } from "@/lib/auth";
import { SubmitForm } from "@/app/submit/submit-form";

export default async function SubmitPage() {
  await requireUser();

  return <SubmitForm />;
}
