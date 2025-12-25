'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const forgotPasswordSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordRequest>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordRequest) => {
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', data);
            setSuccess(true);
            toast.success('Email đặt lại mật khẩu đã được gửi!');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
                    <CardDescription>
                        Nhập email của bạn để lấy lại mật khẩu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="flex flex-col gap-4 text-center">
                            <div className="w-full">
                                <p className="w-full text-sm text-green-800">Email đã được gửi! Vui lòng kiểm tra hộp thư của bạn.</p>
                            </div>
                            <Button asChild variant="outline">
                                <Link href="/signin">Quay lại đăng nhập</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email")}
                                />
                                <FieldError errors={errors.email ? [errors.email] : undefined} />
                            </Field>

                            <Button type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang gửi...
                                    </>
                                ) : (
                                    "Gửi link đặt lại mật khẩu"
                                )}
                            </Button>

                            <div className="text-center text-sm">
                                <Link href="/signin" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                                    <ArrowLeft className="h-4 w-4" />
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
