-- CreateTable
CREATE TABLE `announcements` (
    `announcements_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `description` VARCHAR(200) NOT NULL,
    `date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`announcements_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calendar` (
    `calendar_id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0) NOT NULL,
    `start_time` VARCHAR(20) NOT NULL,
    `end_time` VARCHAR(20) NOT NULL,
    `facilitator` VARCHAR(45) NOT NULL,
    `room` VARCHAR(20) NOT NULL,
    `stat` TINYINT NOT NULL,

    PRIMARY KEY (`calendar_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `email` VARCHAR(50) NOT NULL,
    `firstName` VARCHAR(50) NOT NULL,
    `lastName` VARCHAR(50) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,
    `eligibleAdmin` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faqs` (
    `faqs_id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(200) NOT NULL,
    `answer` VARCHAR(200) NOT NULL,

    PRIMARY KEY (`faqs_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

