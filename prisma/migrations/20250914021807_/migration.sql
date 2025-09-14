-- CreateTable
CREATE TABLE "public"."FcmToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "ua" TEXT,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "FcmToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FcmToken_token_key" ON "public"."FcmToken"("token");

-- AddForeignKey
ALTER TABLE "public"."FcmToken" ADD CONSTRAINT "FcmToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
