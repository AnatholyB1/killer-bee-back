CREATE DATABASE IF NOT EXISTS `db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `db`;


DROP TABLE IF EXISTS `modele_freezbee`;
-- Table modele_freezbee
CREATE TABLE IF NOT EXISTS `modele_freezbee` (
  `IDModele` INT AUTO_INCREMENT PRIMARY KEY,
  `Nom` VARCHAR(255) NOT NULL,
  `Description` TEXT,
  `PUHT` DECIMAL(10, 2) NOT NULL,
  `Gamme` VARCHAR(255)
);


DROP TABLE IF EXISTS `ingredient`;
-- Table ingredient
CREATE TABLE IF NOT EXISTS `ingredient` (
  `IDingredient` INT AUTO_INCREMENT PRIMARY KEY,
  `Nom` VARCHAR(255) NOT NULL,
  `Description` TEXT,
  `Grammage` DECIMAL(10, 2) NOT NULL
);


DROP TABLE IF EXISTS `procede_fabrication`;
-- Table ProcédéFabrication
CREATE TABLE IF NOT EXISTS `procede_fabrication` (
  `IDProcede` INT AUTO_INCREMENT PRIMARY KEY,
  `Nom` VARCHAR(255) NOT NULL,
  `Description` TEXT,
  `IDModele` INT,
  FOREIGN KEY (`IDModele`) REFERENCES `modele_freezbee`(`IDModele`)
);


DROP TABLE IF EXISTS `etape`;
-- Table Étape
CREATE TABLE IF NOT EXISTS `etape` (
  `IDEtape` INT AUTO_INCREMENT PRIMARY KEY,
  `Description` TEXT,
  `ValidationTest` BOOLEAN NOT NULL,
  `IDProcede` INT
  FOREIGN KEY (`IDProcede`) REFERENCES `procede_fabrication`(`IDProcede`)
);


DROP TABLE IF EXISTS `role`;
-- Table Rôle
CREATE TABLE IF NOT EXISTS `role` (
  `IDRole` INT AUTO_INCREMENT PRIMARY KEY,
  `NomRole` VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS `utilisateur`;
-- Table Utilisateur
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `IDUtilisateur` INT AUTO_INCREMENT PRIMARY KEY,
  `Nom` VARCHAR(255) NOT NULL,
  `Prenom` VARCHAR(255) NOT NULL,
  `Email` VARCHAR(255) NOT NULL UNIQUE,
  `MotDePasse` VARCHAR(255) NOT NULL,
  `IDRole` INT,
  FOREIGN KEY (`IDRole`) REFERENCES `role`(`IDRole`)
);





-- Table de relation entre modele_freezbee et ingredient
CREATE TABLE IF NOT EXISTS `modele_freezbee_ingredient` (
  `IDModele` INT,
  `IDingredient` INT,
  PRIMARY KEY (`IDModele`, `IDingredient`),
  FOREIGN KEY (`IDModele`) REFERENCES `modele_freezbee`(`IDModele`),
  FOREIGN KEY (`IDingredient`) REFERENCES `ingredient`(`IDingredient`)
);

-- Table de relation entre ProcédéFabrication et Étape
CREATE TABLE IF NOT EXISTS `procedefabrication_freezbee` (
  `IDProcede` INT,
  `IDEtape` INT,
  `Quantite` DECIMAL(10, 2),
  PRIMARY KEY (`IDProcede`, `IDEtape`),
  FOREIGN KEY (`IDProcede`) REFERENCES `procede_fabrication`(`IDProcede`),
  FOREIGN KEY (`IDEtape`) REFERENCES `etape`(`IDEtape`)
);