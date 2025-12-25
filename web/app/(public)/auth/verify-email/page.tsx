'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            window.location.href = `${apiUrl}/auth/email/verify?token=${token}`;
        } else {
            // Handle missing token, maybe redirect to home
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
            <h1 className="text-xl font-semibold">Đang xác thực email...</h1>
            <p className="text-muted-foreground">Vui lòng đợi giây lát</p>
        </div>
    );
}
