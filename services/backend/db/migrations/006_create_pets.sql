-- 006_create_pets.sql
CREATE TABLE IF NOT EXISTS pets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  species      VARCHAR(20) NOT NULL CHECK (species IN ('gato', 'cachorro')),
  sex          VARCHAR(10) NOT NULL CHECK (sex IN ('macho', 'femea')),
  size         VARCHAR(10) NOT NULL CHECK (size IN ('pequeno', 'medio', 'grande')),
  age_months   INT NOT NULL CHECK (age_months >= 0),
  city         VARCHAR(100) NOT NULL,
  photo_url    TEXT,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pets_species ON pets(species);
CREATE INDEX IF NOT EXISTS idx_pets_city ON pets(city);
