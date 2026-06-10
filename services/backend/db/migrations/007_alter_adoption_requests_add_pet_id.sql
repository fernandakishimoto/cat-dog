-- 007_alter_adoption_requests_add_pet_id.sql
DELETE FROM adoption_requests;

DROP INDEX IF EXISTS idx_adoption_requests_species;

ALTER TABLE adoption_requests
  DROP COLUMN IF EXISTS pet_name,
  DROP COLUMN IF EXISTS pet_species,
  DROP COLUMN IF EXISTS pet_sex,
  DROP COLUMN IF EXISTS pet_size,
  DROP COLUMN IF EXISTS pet_age_months,
  DROP COLUMN IF EXISTS pet_city;

ALTER TABLE adoption_requests
  ADD COLUMN pet_id UUID NOT NULL REFERENCES pets(id);

CREATE INDEX IF NOT EXISTS idx_adoption_requests_pet ON adoption_requests(pet_id);
