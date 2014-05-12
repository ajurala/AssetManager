-- phpMyAdmin SQL Dump
-- version 4.1.7
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 12, 2014 at 03:48 PM
-- Server version: 5.6.15
-- PHP Version: 5.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `assetmanager`
--

-- --------------------------------------------------------

--
-- Table structure for table `accessrole`
--

CREATE TABLE IF NOT EXISTS `accessrole` (
  `access` int(11) NOT NULL,
  `accessname` varchar(20) NOT NULL,
  PRIMARY KEY (`access`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `accessrole`
--

INSERT INTO `accessrole` (`access`, `accessname`) VALUES
(0, 'admin'),
(1, 'all');

-- --------------------------------------------------------

--
-- Table structure for table `assetmanager`
--

CREATE TABLE IF NOT EXISTS `assetmanager` (
  `configured` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`configured`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `assetmanager`
--

INSERT INTO `assetmanager` (`configured`) VALUES
(0);

-- --------------------------------------------------------

--
-- Table structure for table `ci_sessions`
--

CREATE TABLE IF NOT EXISTS `ci_sessions` (
  `session_id` varchar(40) NOT NULL DEFAULT '0',
  `ip_address` varchar(45) NOT NULL DEFAULT '0',
  `user_agent` varchar(120) NOT NULL,
  `last_activity` int(10) unsigned NOT NULL DEFAULT '0',
  `user_data` text NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `last_activity_idx` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ci_sessions`
--

INSERT INTO `ci_sessions` (`session_id`, `ip_address`, `user_agent`, `last_activity`, `user_data`) VALUES
('34d1f4fdd053419448f8a972006014ec', '::1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:28.0) Gecko/20100101 Firefox/28.0', 1399829645, 'a:2:{s:9:"user_data";s:0:"";s:10:"configured";s:1:"1";}'),
('a92aaef504d9e792bb8f99546bd8ec10', '::1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:28.0) Gecko/20100101 Firefox/28.0', 1399907786, 'a:6:{s:9:"user_data";s:0:"";s:10:"configured";s:1:"1";s:8:"loggedin";b:1;s:6:"userid";s:1:"0";s:8:"username";s:5:"admin";s:11:"displayname";s:5:"Admin";}'),
('cb3257fb8cdd8d9ebd6bf73980442e53', '::1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:28.0) Gecko/20100101 Firefox/28.0', 1399832029, 'a:2:{s:9:"user_data";s:0:"";s:10:"configured";s:1:"1";}');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE IF NOT EXISTS `permissions` (
  `uri` varchar(60) NOT NULL,
  `accessrole` int(11) NOT NULL,
  PRIMARY KEY (`uri`,`accessrole`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`uri`, `accessrole`) VALUES
('home', 1),
('login', 1),
('user', 1),
('user/register', 0),
('user/update', 1),
('welcome', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL,
  `username` varchar(30) NOT NULL,
  `userpassword` varchar(100) NOT NULL,
  `displayname` varchar(60) NOT NULL DEFAULT 'User',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE IF NOT EXISTS `user_roles` (
  `userid` int(11) NOT NULL,
  `accessid` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`userid`,`accessid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
