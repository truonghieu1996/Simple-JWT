-- Structure for table `users`
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) DEFAULT NULL,
  `username` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- Insert data for table `users`
LOCK TABLES `users` WRITE;
INSERT INTO `users` (`password`, `username`) VALUES ('$admin$','admin');
UNLOCK TABLES;