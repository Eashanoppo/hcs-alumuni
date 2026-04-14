import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";
import NoticeDetailContent from "@/components/pages/NoticeDetailContent";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  const { data: notice } = await supabase
    .from("notices")
    .select("title, body")
    .eq("id", id)
    .single();

  if (!notice) {
    return {
      title: "Notice Not Found",
    };
  }

  return {
    title: notice.title,
    description: notice.body?.substring(0, 160) || "Read the latest notice from Holy Crescent School Ashulia.",
    openGraph: {
      title: notice.title,
      description: notice.body?.substring(0, 160),
      type: "article",
    },
  };
}

export default async function NoticeDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <NoticeDetailContent id={id} />;
}
