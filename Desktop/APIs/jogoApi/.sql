CREATE DATABASE catalogo_jogos;

USE catalogo_jogos;

CREATE TABLE genero(
id int auto_increment primary key,
nome varchar(200),
descricao varchar(200)
);

CREATE TABLE jogos(
id int auto_increment primary key,
nome varchar(200),
desenvolvedora varchar(200),
sinopse varchar(200),
genero_id int not null,
FOREIGN KEY (genero_id) REFERENCES genero(id)
);