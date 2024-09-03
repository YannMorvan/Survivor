-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Sep 03, 2024 at 09:31 AM
-- Server version: 8.0.35
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `backend-database`
--

-- --------------------------------------------------------

--
-- Table structure for table `clothes`
--

CREATE TABLE `clothes` (
  `id` int NOT NULL,
  `id_customer` int NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `clothes_images`
--

CREATE TABLE `clothes_images` (
  `id` int NOT NULL,
  `id_cloth` int NOT NULL,
  `image` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `surname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `birth_date` date NOT NULL,
  `gender` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `astrological_sign` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers_images`
--

CREATE TABLE `customers_images` (
  `id` int NOT NULL,
  `id_customer` int NOT NULL,
  `image` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `surname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `birth_date` date NOT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `work` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees_images`
--

CREATE TABLE `employees_images` (
  `id` int NOT NULL,
  `id_employee` int NOT NULL,
  `image` mediumblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `encounters`
--

CREATE TABLE `encounters` (
  `id` int NOT NULL,
  `id_customer` int NOT NULL,
  `date` date NOT NULL,
  `rating` int NOT NULL,
  `comment` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `source` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int NOT NULL,
  `id_employee` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date` date NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `max_participants` int NOT NULL,
  `location_x` float NOT NULL,
  `location_y` float NOT NULL,
  `location_name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `id_customer` int NOT NULL,
  `date` date NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `amount` int NOT NULL,
  `comment` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tips`
--

CREATE TABLE `tips` (
  `id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `tip` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clothes`
--
ALTER TABLE `clothes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_customer_for_clothes` (`id_customer`);

--
-- Indexes for table `clothes_images`
--
ALTER TABLE `clothes_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cloth_for_images` (`id_cloth`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers_images`
--
ALTER TABLE `customers_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_customer_for_images` (`id_customer`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees_images`
--
ALTER TABLE `employees_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_employee_for_images` (`id_employee`);

--
-- Indexes for table `encounters`
--
ALTER TABLE `encounters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_customer_for_encounters` (`id_customer`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_employee_for_events` (`id_employee`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_customer_for_payments` (`id_customer`);

--
-- Indexes for table `tips`
--
ALTER TABLE `tips`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clothes`
--
ALTER TABLE `clothes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `clothes_images`
--
ALTER TABLE `clothes_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers_images`
--
ALTER TABLE `customers_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees_images`
--
ALTER TABLE `employees_images`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `encounters`
--
ALTER TABLE `encounters`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tips`
--
ALTER TABLE `tips`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `clothes`
--
ALTER TABLE `clothes`
  ADD CONSTRAINT `id_customer_for_clothes` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `clothes_images`
--
ALTER TABLE `clothes_images`
  ADD CONSTRAINT `id_cloth_for_images` FOREIGN KEY (`id_cloth`) REFERENCES `clothes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `customers_images`
--
ALTER TABLE `customers_images`
  ADD CONSTRAINT `id_customer_for_images` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `employees_images`
--
ALTER TABLE `employees_images`
  ADD CONSTRAINT `id_employee_for_images` FOREIGN KEY (`id_employee`) REFERENCES `employees` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `encounters`
--
ALTER TABLE `encounters`
  ADD CONSTRAINT `id_customer_for_encounters` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `id_employee_for_events` FOREIGN KEY (`id_employee`) REFERENCES `employees` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `id_customer_for_payments` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
