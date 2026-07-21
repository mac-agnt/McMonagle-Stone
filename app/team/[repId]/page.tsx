import { notFound } from "next/navigation";
import { getRepDetail } from "@/lib/mockData";
import { RepDossier } from "@/components/team/RepDossier";

export default async function Page({
  params,
}: {
  params: Promise<{ repId: string }>;
}) {
  const { repId } = await params;
  const detail = getRepDetail(repId);
  if (!detail) notFound();

  return <RepDossier detail={detail} />;
}
