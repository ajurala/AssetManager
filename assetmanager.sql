-- phpMyAdmin SQL Dump
-- version 4.1.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 29, 2014 at 09:48 AM
-- Server version: 5.6.16
-- PHP Version: 5.3.28

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
  `accessid` int(11) NOT NULL,
  `accessname` varchar(20) NOT NULL,
  PRIMARY KEY (`accessid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `accessrole`
--

INSERT INTO `accessrole` (`accessid`, `accessname`) VALUES
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
-- Table structure for table `assets`
--

CREATE TABLE IF NOT EXISTS `assets` (
  `assetid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `date` date NOT NULL,
  `subcategoryid` int(11) NOT NULL,
  `assetname` varchar(50) NOT NULL,
  `assetdescription` text NOT NULL,
  `units` double NOT NULL,
  `ppu` double NOT NULL COMMENT 'priceperunit',
  `cppu` double DEFAULT NULL,
  `unitform` varchar(20) NOT NULL,
  `color` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`assetid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `categoryid` int(11) NOT NULL AUTO_INCREMENT,
  `categoryname` varchar(30) NOT NULL,
  `color` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`categoryid`),
  UNIQUE KEY `categoryname` (`categoryname`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

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
('home/addcategorysubcategory', 1),
('home/addupdateasset', 1),
('home/getnetassets', 1),
('home/getotherinfo', 1),
('home/removeeasset', 1),
('login', 999),
('otheruserupdate', 0),
('user', 1),
('user/firstrun', 999),
('user/firstrun/configure', 999),
('user/register', 0),
('user/register/new', 0),
('user/update', 1),
('user/update/all', 1),
('user/update/displayname', 1),
('user/users', 0),
('user/users/all', 0),
('welcome', 999);

-- --------------------------------------------------------

--
-- Table structure for table `riskcategories`
--

CREATE TABLE IF NOT EXISTS `riskcategories` (
  `riskid` int(11) NOT NULL AUTO_INCREMENT,
  `riskname` varchar(20) NOT NULL,
  `color` varchar(7) NOT NULL,
  PRIMARY KEY (`riskid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `riskcategories`
--

INSERT INTO `riskcategories` (`riskid`, `riskname`, `color`) VALUES
(1, 'Very High', '#500000'),
(2, 'High', '#FF0000'),
(3, 'Medium', '#0000FF'),
(4, 'Low', '#32CD32'),
(5, 'Very Low', '#006400'),
(6, 'No', '#00FF00');

-- --------------------------------------------------------

--
-- Table structure for table `specialperm`
--

CREATE TABLE IF NOT EXISTS `specialperm` (
  `uri` varchar(40) NOT NULL,
  `accessrole` int(11) NOT NULL,
  PRIMARY KEY (`uri`,`accessrole`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `specialperm`
--

INSERT INTO `specialperm` (`uri`, `accessrole`) VALUES
('user/view/', 0);

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE IF NOT EXISTS `subcategories` (
  `categoryid` int(11) NOT NULL,
  `subcategoryid` int(11) NOT NULL AUTO_INCREMENT,
  `riskid` int(11) NOT NULL,
  `subcategoryname` varchar(40) NOT NULL,
  `currentpriceperunit` double DEFAULT NULL,
  `unitform` varchar(20) NOT NULL,
  `color` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`subcategoryid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

CREATE TABLE IF NOT EXISTS `userroles` (
  `userid` int(11) NOT NULL,
  `accessid` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`userid`,`accessid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) NOT NULL,
  `username` varchar(30) NOT NULL,
  `userpassword` varchar(100) NOT NULL,
  `displayname` varchar(60) NOT NULL DEFAULT 'User',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
