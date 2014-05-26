-- phpMyAdmin SQL Dump
-- version 4.1.7
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 26, 2014 at 04:00 PM
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
(1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `assets`
--

INSERT INTO `assets` (`assetid`, `userid`, `date`, `subcategoryid`, `assetname`, `assetdescription`, `units`, `ppu`, `cppu`, `unitform`, `color`) VALUES
(1, 0, '2014-04-17', 6, 'HDFC 2000', 'Equity mutual fund', 46, 20, 32, '', '#ff0000');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `categoryid` int(11) NOT NULL AUTO_INCREMENT,
  `categoryname` varchar(30) NOT NULL,
  `color` int(11) DEFAULT NULL,
  PRIMARY KEY (`categoryid`),
  UNIQUE KEY `categoryname` (`categoryname`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryid`, `categoryname`, `color`) VALUES
(1, 'Mutual Funds', NULL);

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
('f5d3b78de0483a6239658a1c102873ca', '::1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:29.0) Gecko/20100101 Firefox/29.0', 1401119654, 'a:11:{s:9:"user_data";s:0:"";s:11:"permissions";a:23:{s:4:"home";s:1:"1";s:27:"home/addcategorysubcategory";s:1:"1";s:19:"home/addupdateasset";s:1:"1";s:17:"home/getnetassets";s:1:"1";s:17:"home/getotherinfo";s:1:"1";s:17:"home/removeeasset";s:1:"1";s:5:"login";s:3:"999";s:15:"otheruserupdate";s:1:"0";s:4:"user";s:1:"1";s:13:"user/firstrun";s:3:"999";s:23:"user/firstrun/configure";s:3:"999";s:13:"user/register";s:1:"0";s:17:"user/register/new";s:1:"0";s:11:"user/update";s:1:"1";s:15:"user/update/all";s:1:"1";s:23:"user/update/displayname";s:1:"1";s:10:"user/users";s:1:"0";s:14:"user/users/all";s:1:"0";s:7:"welcome";s:3:"999";s:12:"user/view/aj";s:1:"0";s:13:"user/view/aja";s:1:"0";s:13:"user/view/aks";s:1:"0";s:13:"user/view/all";s:1:"0";}s:10:"configured";s:1:"1";s:8:"loggedin";b:1;s:6:"userid";s:1:"0";s:8:"username";s:5:"admin";s:11:"displayname";s:5:"Admin";s:11:"accessroles";a:2:{i:0;s:5:"admin";i:1;s:3:"all";}s:13:"accessroleids";a:2:{i:0;s:1:"0";i:1;s:1:"1";}s:5:"admin";b:1;s:13:"currentuserid";s:1:"0";}');

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
  `color` int(11) DEFAULT NULL,
  PRIMARY KEY (`subcategoryid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`categoryid`, `subcategoryid`, `riskid`, `subcategoryname`, `currentpriceperunit`, `unitform`, `color`) VALUES
(1, 1, 1, 'Large Cap', NULL, '', NULL),
(1, 6, 1, 'Small Cap', NULL, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

CREATE TABLE IF NOT EXISTS `userroles` (
  `userid` int(11) NOT NULL,
  `accessid` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`userid`,`accessid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userroles`
--

INSERT INTO `userroles` (`userid`, `accessid`) VALUES
(0, 0),
(0, 1),
(1, 0),
(1, 1),
(2, 0),
(2, 1),
(3, 1);

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

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `userpassword`, `displayname`) VALUES
(0, 'admin', '$2a$14$54kXObE4SArJaGNY6.rPl.9r2efXQvmXXW5pFDvSAWXwPBMY9pmVG', 'Admin'),
(1, 'aj', '$2a$14$KgEiHuBpWYVxGL3FV1DH4ebStu2EdPqDDy3Yc2l.mRKRBt6tHp0CW', 'Aj'),
(2, 'aja', '$2a$14$78KZ9jId3ZuZM1YZDmIlzOKXILJpYMgPYVNCrGYRd4.8.UnIotbLq', 'Aja'),
(3, 'aks', '$2a$14$AaXE5Rj483AR9LUdZM53web/FkdtDfdzaSxvGEPOp3NHnTQhcalha', 'aska');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
