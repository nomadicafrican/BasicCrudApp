

DROP TABLE IF EXISTS cards CASCADE;

CREATE TABLE cards (
  id SERIAL PRIMARY KEY NOT NULL, 
  graphics_card VARCHAR(255) NOT NULL, 
  quantity INTEGER NOT NULL, 
  description VARCHAR(255),
  price INTEGER NOT NULL 
);
