import TemporaryUnavailable from '@/components/feedback/TemporaryUnavailable';

export default function ServiceUnavailablePage() {
    return (
        <div className="min-h-[70vh] bg-brand-cream/60 px-6 py-12">
            <div className="container mx-auto max-w-4xl">
                <TemporaryUnavailable />
            </div>
        </div>
    );
}
