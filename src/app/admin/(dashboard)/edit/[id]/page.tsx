import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/storage/articles";
import { EditArticleClient } from "./EditArticleClient";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminEditArticlePage({ params }: EditPageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return <EditArticleClient initialArticle={article} />;
}
