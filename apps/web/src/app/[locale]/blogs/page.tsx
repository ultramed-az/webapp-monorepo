import { redirect } from 'next/navigation';

type BlogsAliasPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function BlogsAliasPage({ params }: BlogsAliasPageProps) {
  const { locale } = await params;
  redirect(`/${locale}/blog`);
}
