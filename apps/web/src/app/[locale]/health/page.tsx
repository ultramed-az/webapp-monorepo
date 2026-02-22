import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HealthPage() {
    const now = new Date().toISOString();

    return (
        <div className="min-h-screen bg-slate-50 py-16">
            <div className="container mx-auto px-6 max-w-3xl">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl text-slate-900">Frontend Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-slate-700">
                        <p>
                            Sehife render olunur, routing aktivdir ve frontend cavab verir.
                        </p>
                        <div className="bg-white rounded-lg border border-slate-200 p-4 font-mono text-sm">
                            <p><strong>status:</strong> ok</p>
                            <p><strong>component:</strong> web-frontend</p>
                            <p><strong>checkedAt:</strong> {now}</p>
                        </div>
                        <p>
                            JSON endpoint: <Link href="/health" className="text-blue-600 hover:underline">/health</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
