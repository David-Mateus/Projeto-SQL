CREATE OR REPLACE PROCEDURE ObterLivroPorISBN(livro_isbn IN VARCHAR2)
IS
  RESULTADO Livro%ROWTYPE; //representa uma linha na tabela Livro.
BEGIN
  SELECT * INTO RESULTADO FROM LIVRO
  WHERE ISBN = livro_isbn;
  
  DBMS_OUTPUT.PUT_LINE(RESULTADO.ISBN || ' - ' || RESULTADO.Titulo || ' - ' || RESULTADO.Autor);
END;

EXECUTE ObterLivroPorISBN('000001');