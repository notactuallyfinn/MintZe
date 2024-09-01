-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 01. Sep 2024 um 21:43
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `mintze_db`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `aktivitaet`
--

CREATE TABLE `aktivitaet` (
  `AID` int(5) NOT NULL,
  `kann2` tinyint(1) NOT NULL,
  `Name` varchar(128) NOT NULL,
  `Beschreibung` text DEFAULT NULL,
  `MaxAnzahl` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `aleistung`
--

CREATE TABLE `aleistung` (
  `ALID` int(5) NOT NULL,
  `Bezeichnung` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `lehrer`
--

CREATE TABLE `lehrer` (
  `Kuerzel` varchar(4) NOT NULL,
  `Name` varchar(64) NOT NULL,
  `Ansprache` enum('Frau','Herr','Mx') NOT NULL,
  `Passwort` varchar(64) NOT NULL,
  `AuthKey` varchar(64) DEFAULT NULL,
  `Fach1` int(5) NOT NULL,
  `Fach2` int(5) DEFAULT NULL,
  `Fach3` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `machta`
--

CREATE TABLE `machta` (
  `SID` int(5) NOT NULL,
  `Kuerzel` varchar(4) NOT NULL,
  `AID` int(5) NOT NULL,
  `bestaetigt` tinyint(1) NOT NULL,
  `Klassenstufe` enum('5','6','7','8','9','10','Q1','Q2','Q3','Q4','11') NOT NULL,
  `Stufe` enum('0','1','2','3') NOT NULL,
  `Titel` varchar(255) DEFAULT NULL,
  `Datum` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `machtsf`
--

CREATE TABLE `machtsf` (
  `SID` int(5) NOT NULL,
  `SFID` int(5) NOT NULL,
  `Kuerzel` varchar(4) DEFAULT NULL,
  `Datum` date NOT NULL,
  `Klassenstufe` enum('5','6','7','8','9','10','Q1','Q2','Q3','Q4','11') NOT NULL,
  `bestaetigt` tinyint(1) NOT NULL,
  `Note` int(2) NOT NULL,
  `Titel` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `optionen`
--

CREATE TABLE `optionen` (
  `AID` int(5) NOT NULL,
  `ALID` int(5) NOT NULL,
  `Stufe` enum('0','1','2','3') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `passwortreset`
--

CREATE TABLE `passwortreset` (
  `PWID` int(5) NOT NULL,
  `SID` int(5) NOT NULL,
  `ResetKey` varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `schueler`
--

CREATE TABLE `schueler` (
  `SID` int(5) NOT NULL,
  `Benutzername` varchar(64) NOT NULL,
  `Name` varchar(64) NOT NULL,
  `Vorname` varchar(64) NOT NULL,
  `Klasse` enum('5','6','7','8','9','10','Q1','Q2','Q3','Q4','11') NOT NULL,
  `Passwort` varchar(64) NOT NULL,
  `AuthKey` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `schulfach`
--

CREATE TABLE `schulfach` (
  `SFID` int(5) NOT NULL,
  `Name` enum('Mathe','Physik','NAWI','Biologie','Chemie','Informatik','BLL','Fachwissenschaftliche Arbeit','wissenschaftspropädeutisches Fach') NOT NULL,
  `Art` enum('GK','LK') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `aktivitaet`
--
ALTER TABLE `aktivitaet`
  ADD PRIMARY KEY (`AID`);

--
-- Indizes für die Tabelle `aleistung`
--
ALTER TABLE `aleistung`
  ADD PRIMARY KEY (`ALID`);

--
-- Indizes für die Tabelle `lehrer`
--
ALTER TABLE `lehrer`
  ADD PRIMARY KEY (`Kuerzel`),
  ADD KEY `Fach1` (`Fach1`),
  ADD KEY `Fach2` (`Fach2`),
  ADD KEY `Fach3` (`Fach3`);

--
-- Indizes für die Tabelle `machta`
--
ALTER TABLE `machta`
  ADD PRIMARY KEY (`Datum`,`SID`,`AID`),
  ADD KEY `SID` (`SID`),
  ADD KEY `Kuerzel` (`Kuerzel`),
  ADD KEY `AID` (`AID`);

--
-- Indizes für die Tabelle `machtsf`
--
ALTER TABLE `machtsf`
  ADD PRIMARY KEY (`Datum`,`SID`,`SFID`),
  ADD KEY `SID` (`SID`),
  ADD KEY `SFID` (`SFID`),
  ADD KEY `Kuerzel` (`Kuerzel`);

--
-- Indizes für die Tabelle `optionen`
--
ALTER TABLE `optionen`
  ADD PRIMARY KEY (`AID`,`ALID`),
  ADD KEY `ALID` (`ALID`);

--
-- Indizes für die Tabelle `passwortreset`
--
ALTER TABLE `passwortreset`
  ADD PRIMARY KEY (`PWID`),
  ADD KEY `SID` (`SID`);

--
-- Indizes für die Tabelle `schueler`
--
ALTER TABLE `schueler`
  ADD PRIMARY KEY (`SID`),
  ADD UNIQUE KEY `Benutzername` (`Benutzername`);

--
-- Indizes für die Tabelle `schulfach`
--
ALTER TABLE `schulfach`
  ADD PRIMARY KEY (`SFID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `aktivitaet`
--
ALTER TABLE `aktivitaet`
  MODIFY `AID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `aleistung`
--
ALTER TABLE `aleistung`
  MODIFY `ALID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `passwortreset`
--
ALTER TABLE `passwortreset`
  MODIFY `PWID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `schueler`
--
ALTER TABLE `schueler`
  MODIFY `SID` int(5) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `schulfach`
--
ALTER TABLE `schulfach`
  MODIFY `SFID` int(5) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `lehrer`
--
ALTER TABLE `lehrer`
  ADD CONSTRAINT `lehrer_ibfk_1` FOREIGN KEY (`Fach1`) REFERENCES `schulfach` (`SFID`),
  ADD CONSTRAINT `lehrer_ibfk_2` FOREIGN KEY (`Fach2`) REFERENCES `schulfach` (`SFID`),
  ADD CONSTRAINT `lehrer_ibfk_3` FOREIGN KEY (`Fach3`) REFERENCES `schulfach` (`SFID`);

--
-- Constraints der Tabelle `machta`
--
ALTER TABLE `machta`
  ADD CONSTRAINT `machta_ibfk_1` FOREIGN KEY (`SID`) REFERENCES `schueler` (`SID`),
  ADD CONSTRAINT `machta_ibfk_2` FOREIGN KEY (`Kuerzel`) REFERENCES `lehrer` (`Kuerzel`),
  ADD CONSTRAINT `machta_ibfk_3` FOREIGN KEY (`AID`) REFERENCES `aktivitaet` (`AID`);

--
-- Constraints der Tabelle `machtsf`
--
ALTER TABLE `machtsf`
  ADD CONSTRAINT `machtsf_ibfk_1` FOREIGN KEY (`SID`) REFERENCES `schueler` (`SID`),
  ADD CONSTRAINT `machtsf_ibfk_2` FOREIGN KEY (`SFID`) REFERENCES `schulfach` (`SFID`),
  ADD CONSTRAINT `machtsf_ibfk_3` FOREIGN KEY (`Kuerzel`) REFERENCES `lehrer` (`Kuerzel`);

--
-- Constraints der Tabelle `optionen`
--
ALTER TABLE `optionen`
  ADD CONSTRAINT `optionen_ibfk_1` FOREIGN KEY (`AID`) REFERENCES `aktivitaet` (`AID`),
  ADD CONSTRAINT `optionen_ibfk_2` FOREIGN KEY (`ALID`) REFERENCES `aleistung` (`ALID`);

--
-- Constraints der Tabelle `passwortreset`
--
ALTER TABLE `passwortreset`
  ADD CONSTRAINT `passwortreset_ibfk_1` FOREIGN KEY (`SID`) REFERENCES `schueler` (`SID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
