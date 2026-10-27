-- OTK Otewe Kantin - skema database MySQL untuk phpMyAdmin
-- Buat database otk_db di phpMyAdmin terlebih dahulu, lalu pilih database dan import file ini.
-- ID dibuat oleh Prisma Client (cuid), jadi kolom ID tidak memakai AUTO_INCREMENT.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE IF NOT EXISTS `Product` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `category` VARCHAR(191) NOT NULL,
  `price` INTEGER NOT NULL,
  `description` TEXT NOT NULL,
  `image` TEXT NOT NULL,
  `stock` INTEGER NOT NULL DEFAULT 0,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Order` (
  `id` VARCHAR(191) NOT NULL,
  `orderNumber` VARCHAR(191) NOT NULL,
  `customerName` VARCHAR(191) NOT NULL,
  `customerPhone` VARCHAR(191) NOT NULL,
  `customerEmail` VARCHAR(191) NULL,
  `fulfillment` VARCHAR(191) NOT NULL,
  `address` TEXT NULL,
  `note` TEXT NULL,
  `total` INTEGER NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'MENUNGGU_PEMBAYARAN',
  `paymentStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  `midtransOrderId` VARCHAR(191) NULL,
  `snapToken` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Order_orderNumber_key` (`orderNumber`),
  UNIQUE INDEX `Order_midtransOrderId_key` (`midtransOrderId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `OrderItem` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `price` INTEGER NOT NULL,
  `quantity` INTEGER NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `OrderItem_orderId_idx` (`orderId`),
  INDEX `OrderItem_productId_idx` (`productId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `PaymentEvent` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL,
  `payload` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `PaymentEvent_orderId_idx` (`orderId`),
  CONSTRAINT `PaymentEvent_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS=1;
