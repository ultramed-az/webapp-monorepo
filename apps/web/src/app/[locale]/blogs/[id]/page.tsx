import { redirect } from 'next/navigation';

type BlogAliasDetailPageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function BlogAliasDetailPage({ params }: BlogAliasDetailPageProps) {
  const { locale, id } = await params;
  redirect(`/${locale}/blog/${id}`);
}
