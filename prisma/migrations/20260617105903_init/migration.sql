/*
  Warnings:

  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `student` table. All the data in the column will be lost.
  - Added the required column `address` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfBirth` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentName` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Student_code_key` ON `student`;

-- DropIndex
DROP INDEX `Student_email_key` ON `student`;

-- AlterTable
ALTER TABLE `student` DROP PRIMARY KEY,
    DROP COLUMN `code`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `email`,
    DROP COLUMN `id`,
    DROP COLUMN `name`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `dateOfBirth` DATETIME(3) NOT NULL,
    ADD COLUMN `gender` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `studentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `studentName` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`studentId`);

-- CreateTable
CREATE TABLE `Subject` (
    `subjectId` VARCHAR(191) NOT NULL,
    `subjectName` VARCHAR(191) NOT NULL,
    `semester` VARCHAR(191) NOT NULL,
    `credit` INTEGER NOT NULL,
    `instructor` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`subjectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Registration` (
    `registerId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `subjectId` VARCHAR(191) NOT NULL,
    `registerDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `academicYear` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`registerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `paymentId` VARCHAR(191) NOT NULL,
    `registerId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL,
    `paymentStatus` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Payment_registerId_key`(`registerId`),
    PRIMARY KEY (`paymentId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`studentId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Registration` ADD CONSTRAINT `Registration_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`subjectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_registerId_fkey` FOREIGN KEY (`registerId`) REFERENCES `Registration`(`registerId`) ON DELETE RESTRICT ON UPDATE CASCADE;
