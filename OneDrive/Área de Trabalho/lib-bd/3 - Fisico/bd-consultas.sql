--------------------- CONSULTAS ---------------------
-- ESCALAR
-- Consulta: Projetar os nomes do bibliotecário, onde o codigo do bibliotecário tem que igual a media dos códigos das bibliotecas.

SELECT A.NOME
FROM BIBLIOTECARIO A
WHERE A.COD_BIBLIOTECARIO = (SELECT AVG(B.COD)
FROM BIBLIOTECA B);

-- LINHA

-- Consulta: Projetar o título, código da estante e código da biblioteca e que autor e título sejam iguais a do livro cujo ISBN é igual a '000005’.

SELECT L.TITULO, L.COD_ESTANTE, L.COD_BIBLIOTECA
FROM LIVRO L
WHERE (L.AUTOR, L.TITULO) = (SELECT L.AUTOR, L.TITULO
FROM LIVRO L
WHERE L.ISBN = '000005');

-- TABELA

-- Consulta: Projetar o autor e o titulo dos livros que possuem o mesmo ISBN igual ao ISBN dos livros localizados na estante de codigo 006 e na biblioteca com codigo 002.

SELECT L.AUTOR, L.TITULO
FROM LIVRO L
WHERE L.ISBN =ANY (SELECT L.ISBN
FROM LIVRO L
WHERE L.COD_ESTANTE = '006' AND
L.COD_BIBLIOTECA = '002');

-- OPERAÇÕES DE CONJUNTO

-- Consulta: Projetar todos os usuários 

SELECT A.CPF 
FROM ALUNO A
UNION
SELECT P.CPF

--Group by/Having
SELECT TRADUCAO, COUNT(*) AS QTD
    FROM LIVRO
    GROUP BY TRADUCAO HAVING TRADUCAO = 'EN-US';

--Junção interna
SELECT A.TITULO, B.COD, B.END_LOGRADOURO
FROM LIVRO A INNER JOIN BIBLIOTECA B ON (A.COD_BIBLIOTECA = B.COD);


--Junção externa
SELECT * FROM USUARIO U
LEFT OUTER JOIN ALUGA A
ON (U.CPF = A.CPF);


--Semi junção
SELECT A.NOME FROM BIBLIOTECARIO A 
WHERE EXISTS
(SELECT * FROM BIBLIOTECA B WHERE A.COD_BIBLIOTECA = B.COD);


--Anti-junção
SELECT L.TITULO FROM LIVRO L 
WHERE NOT EXISTS
(SELECT * FROM ESTANTE E WHERE L.COD_ESTANTE = E.COD_ESTANTE);