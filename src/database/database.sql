CREATE DATABASE dindin;

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  email VARCHAR(80) NOT NULL UNIQUE,
  senha VARCHAR(80) NOT NULL
);

CREATE INDEX idx_email ON usuarios (email);

CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255)
);

INSERT INTO categorias
(descricao)
VALUES
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');

CREATE TABLE transacoes (
  id SERIAL PRIMARY KEY,
  descricao TEXT,
  valor INTEGER NOT NULL,
  data TIMESTAMP DEFAULT NOW(),
  categoria_id INTEGER REFERENCES categorias (id),
  usuario_id INTEGER REFERENCES usuarios (id),
  tipo VARCHAR(20)
);

