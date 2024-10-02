CREATE DATABASE sistema;

USE sistema;

CREATE TABLE categoria(
    cat_codigo INT NOT NULL AUTO_INCREMENT,
    cat_descricao VARCHAR(100) NOT NULL,
    CONSTRAINT pk_categoria PRIMARY KEY(cat_codigo)
);

CREATE TABLE maquinario(
    mq_codigo INT NOT NULL AUTO_INCREMENT,
    mq_descricao VARCHAR(100) NOT NULL,
    mq_precoCusto DECIMAL(10,2) NOT NULL DEFAULT 0,
    mq_precoVenda DECIMAL(10,2) NOT NULL DEFAULT 0,
    mq_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
    cat_codigo INT NOT NULL,
    CONSTRAINT pk_maquinario PRIMARY KEY(mq_codigo),
);