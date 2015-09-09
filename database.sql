DROP DATABASE IF EXISTS matopeli;
CREATE DATABASE matopeli;
USE matopeli;

CREATE TABLE kayttaja (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nickname VARCHAR(30) NOT NULL,
    salasana VARCHAR(30),
    maxpisteet INT,
    pelatutpelit INT
)ENGINE=InnoDB;

CREATE TABLE chat (
    id INT PRIMARY KEY AUTO_INCREMENT,
    viesti VARCHAR(100),
    lahettaja VARCHAR(30),
    aika TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE=InnoDB;