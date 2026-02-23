import { Skeleton } from '@/components/ui/skeleton';

type PageLoadingScreenProps = {
    titleBars?: number;
    cardCount?: number;
};

export default function PageLoadingScreen({ titleBars = 2, cardCount = 6 }: PageLoadingScreenProps) {
    return (
        <section className="min-h-[70vh] bg-brand-cream/60 py-12">
            <div className="container mx-auto px-6">
                <div className="mx-auto mb-10 max-w-3xl space-y-3">
                    {Array.from({ length: titleBars }).map((_, index) => (
                        <Skeleton key={`title-${index}`} className={`h-6 ${index === 0 ? 'w-2/3' : 'w-full'}`} />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: cardCount }).map((_, index) => (
                        <div key={`card-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5">
                            <Skeleton className="mb-4 h-12 w-12 rounded-xl" />
                            <Skeleton className="mb-3 h-5 w-3/4" />
                            <Skeleton className="mb-2 h-4 w-full" />
                            <Skeleton className="mb-2 h-4 w-11/12" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
