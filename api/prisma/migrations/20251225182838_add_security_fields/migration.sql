-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastResetPasswordRequest" TIMESTAMP(3),
ADD COLUMN     "lastVerificationRequest" TIMESTAMP(3),
ADD COLUMN     "verificationExpires" TIMESTAMP(3),
ADD COLUMN     "verificationRequests" INTEGER NOT NULL DEFAULT 0;
