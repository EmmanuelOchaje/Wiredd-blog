/*
  Warnings:

  - You are about to drop the column `cover` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `post` DROP COLUMN `cover`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `avatar`;
