-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: bcit_bsn
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.10.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcements`
--


/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `announcements` (
  `announcements_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `description` varchar(200) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`announcements_id`)
) ENGINE=InnoDB AUTO_INCREMENT=311 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT IGNORE INTO `announcements` VALUES (1,'Welcome!','Welcome to the BSN OpenLab Scheduler!','2023-03-22 19:00:00');

/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar`
--


/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `calendar` (
  `calendar_id` int NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `start-time` varchar(20) NOT NULL,
  `end-time` varchar(20) NOT NULL,
  `facilitator` varchar(45) NOT NULL,
  `room` varchar(20) NOT NULL,
  `stat` tinyint NOT NULL,
  PRIMARY KEY (`calendar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `calendar` WRITE;
/*!40000 ALTER TABLE `calendar` DISABLE KEYS */;
INSERT IGNORE INTO `calendar` VALUES (1,'2023-03-24 00:00:00','01:01','05:02','Jason', 'SE12', 0);

/*!40000 ALTER TABLE `calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--


/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `logoutTime` datetime DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT IGNORE INTO `users` VALUES (1,'admin@bcit.ca','$2b$10$jzoaDACK85GlvbYhbuXHsO51BQr.TnR6Ek3WGT/69i/401Js7SCkq',1,'2023-03-02 22:19:16'), (2,'student@bcit.ca','$2a$10$yqmwqZL/mo.zrTzFiY94fu6GPhfRLPQDJHnfbRtGH9IcaqjMBZj72',0,'2023-03-02 22:19:16');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `openlabGuidelines` (
  `filename` varchar(50) NOT NULL 
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-03 16:57:07
