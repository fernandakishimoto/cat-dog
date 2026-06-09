-- 005_create_adoption_requests.sql
DROP TYPE IF EXISTS adoption_status CASCADE;
CREATE TYPE adoption_status AS ENUM (
  'formulario',
  'documentacao',
  'entrevista',
  'visita',
  'aprovacao_final',
  'aprovado',
  'rejeitado'
);

CREATE TABLE IF NOT EXISTS adoption_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  adopter_id      UUID NOT NULL,
  adopter_name    VARCHAR(200) NOT NULL,
  adopter_email   VARCHAR(320) NOT NULL,
  pet_name        VARCHAR(100) NOT NULL,
  pet_species     VARCHAR(20) NOT NULL CHECK (pet_species IN ('gato', 'cachorro')),
  pet_sex         VARCHAR(10) NOT NULL CHECK (pet_sex IN ('macho', 'femea')),
  pet_size        VARCHAR(10) NOT NULL CHECK (pet_size IN ('pequeno', 'medio', 'grande')),
  pet_age_months  INT NOT NULL CHECK (pet_age_months >= 0),
  pet_city        VARCHAR(100) NOT NULL,
  status          adoption_status NOT NULL DEFAULT 'formulario',
  observations    TEXT
);

CREATE INDEX IF NOT EXISTS idx_adoption_requests_status   ON adoption_requests(status);
CREATE INDEX IF NOT EXISTS idx_adoption_requests_species  ON adoption_requests(pet_species);
CREATE INDEX IF NOT EXISTS idx_adoption_requests_adopter  ON adoption_requests(adopter_id);
