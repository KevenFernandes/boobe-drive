import { deleteSession } from "@/src/lib/auth/session";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}
