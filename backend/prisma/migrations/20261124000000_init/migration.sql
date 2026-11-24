BEGIN;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "failure_case_status" AS ENUM ('active', 'archived');

-- CreateTable
CREATE TABLE "device_models" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "brand" VARCHAR(80) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "created_order" BIGSERIAL NOT NULL,

    CONSTRAINT "device_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failure_cases" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "device_model_id" TEXT NOT NULL,
    "symptom" VARCHAR(500) NOT NULL,
    "diagnosis" VARCHAR(2000) NOT NULL DEFAULT '',
    "solution" VARCHAR(2000) NOT NULL DEFAULT '',
    "status" "failure_case_status" NOT NULL DEFAULT 'active',
    "created_order" BIGSERIAL NOT NULL,

    CONSTRAINT "failure_cases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_models_created_order_key" ON "device_models"("created_order");

-- CreateIndex
CREATE UNIQUE INDEX "failure_cases_created_order_key" ON "failure_cases"("created_order");

-- CreateIndex
CREATE INDEX "failure_cases_device_model_id_idx" ON "failure_cases"("device_model_id");

-- AddForeignKey
ALTER TABLE "failure_cases" ADD CONSTRAINT "failure_cases_device_model_id_fkey" FOREIGN KEY ("device_model_id") REFERENCES "device_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Preserve case-insensitive model uniqueness under concurrent writes.
CREATE UNIQUE INDEX "device_models_brand_name_ci_key" ON "device_models" (lower("brand"), lower("name"));

COMMIT;
