const QUERY = {
    DELETE_INGREDIENT: `
      DELETE FROM ingredient WHERE IDingredient = ?;
    `,
    CREATE_INGREDIENT: `
    INSERT INTO ingredient (Nom, Description, Grammage)
      VALUES (?, ?, ?);
    `,
    SELECT_ALL_INGREDIENTS: `
      SELECT * FROM ingredient;
    `,
    SELECT_INGREDIENT_BY_ID: `
      SELECT * FROM ingredient WHERE IDingredient = ?;
    `,
    UPDATE_INGREDIENT: `
      UPDATE ingredient
      SET Nom = ?, Description = ?, Grammage = ?
      WHERE IDingredient = ?;
    `
  };
  
  export default QUERY;