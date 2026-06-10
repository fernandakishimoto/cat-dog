#!/usr/bin/env node
/**
 * Seed script: insere pets e solicitações de adoção de exemplo.
 *
 * Requer:
 *   - supabase CLI instalado e linkado: supabase login + supabase link --project-ref <ref>
 *   - Migrations 006 e 007 já executadas
 *
 * Uso:
 *   node scripts/seed_pets_and_requests.js
 *
 * Para recriar os dados do zero (apaga e reinsere):
 *   node scripts/seed_pets_and_requests.js --reset
 */

const { spawnSync } = require('child_process');

const RESET = process.argv.includes('--reset');

// ---------------------------------------------------------------------------
// Fotos aleatórias de pets usando a API pública do The Cat API / Dog CEO
// (URLs estáticas para não depender de request em runtime)
// ---------------------------------------------------------------------------
// loremflickr.com — CDN estável com fotos reais por palavra-chave
// O parâmetro ?lock=N garante que sempre retorna a mesma imagem para o mesmo lock
const DOG_PHOTOS = [
  'https://loremflickr.com/300/300/golden-retriever?lock=1',
  'https://loremflickr.com/300/300/labrador-dog?lock=2',
  'https://loremflickr.com/300/300/french-bulldog?lock=3',
  'https://loremflickr.com/300/300/poodle-dog?lock=4',
  'https://loremflickr.com/300/300/beagle-dog?lock=5',
  'https://loremflickr.com/300/300/shiba-inu?lock=6',
  'https://loremflickr.com/300/300/husky-dog?lock=7',
  'https://loremflickr.com/300/300/corgi-dog?lock=8',
];

const CAT_PHOTOS = [
  'https://loremflickr.com/300/300/tabby-cat?lock=10',
  'https://loremflickr.com/300/300/persian-cat?lock=11',
  'https://loremflickr.com/300/300/siamese-cat?lock=12',
  'https://loremflickr.com/300/300/kitten?lock=13',
  'https://loremflickr.com/300/300/bengal-cat?lock=14',
];

// ---------------------------------------------------------------------------
// Dados de seed
// ---------------------------------------------------------------------------
const PETS = [
  { name: 'Luna',    species: 'cachorro', sex: 'femea',  size: 'medio',   age_months: 18, city: 'Campo Mourão',  photo: DOG_PHOTOS[0] },
  { name: 'Thor',    species: 'cachorro', sex: 'macho',  size: 'grande',  age_months: 36, city: 'Curitiba',      photo: DOG_PHOTOS[1] },
  { name: 'Mel',     species: 'cachorro', sex: 'femea',  size: 'pequeno', age_months: 8,  city: 'Maringá',       photo: DOG_PHOTOS[2] },
  { name: 'Bob',     species: 'cachorro', sex: 'macho',  size: 'grande',  age_months: 24, city: 'Londrina',      photo: DOG_PHOTOS[3] },
  { name: 'Nina',    species: 'gato',     sex: 'femea',  size: 'pequeno', age_months: 12, city: 'São Paulo',     photo: CAT_PHOTOS[0] },
  { name: 'Simba',   species: 'gato',     sex: 'macho',  size: 'medio',   age_months: 30, city: 'Belo Horizonte',photo: CAT_PHOTOS[1] },
  { name: 'Pipoca',  species: 'cachorro', sex: 'femea',  size: 'pequeno', age_months: 6,  city: 'Porto Alegre',  photo: DOG_PHOTOS[4] },
  { name: 'Rex',     species: 'cachorro', sex: 'macho',  size: 'grande',  age_months: 48, city: 'Florianópolis', photo: DOG_PHOTOS[5] },
  { name: 'Mimi',    species: 'gato',     sex: 'femea',  size: 'pequeno', age_months: 16, city: 'Recife',        photo: CAT_PHOTOS[2] },
  { name: 'Zeus',    species: 'cachorro', sex: 'macho',  size: 'grande',  age_months: 60, city: 'Salvador',      photo: DOG_PHOTOS[6] },
  { name: 'Mel',     species: 'gato',     sex: 'femea',  size: 'pequeno', age_months: 9,  city: 'Campinas',      photo: CAT_PHOTOS[3] },
  { name: 'Bolinha', species: 'cachorro', sex: 'macho',  size: 'medio',   age_months: 14, city: 'Fortaleza',     photo: DOG_PHOTOS[0] },
];

const ADOPTERS = [
  { name: 'Pedro Sicuro Scremin',  email: 'pedrosicuroscremin@gmail.com' },
  { name: 'Ana Lima',              email: 'ana.lima@provedor.com' },
  { name: 'Carlos Eduardo Souza',  email: 'carlos.eduardo@email.com.br' },
  { name: 'Fernanda Rocha',        email: 'fernanda.rocha@gmail.com' },
  { name: 'Rafael Martins',        email: 'rafael.martins@hotmail.com' },
  { name: 'Juliana Ferreira',      email: 'ju.ferreira@outlook.com' },
  { name: 'Marcos Vinícius',       email: 'marcos.vinicius@provedor.com' },
  { name: 'Camila Pereira',        email: 'camila.p@gmail.com' },
  { name: 'Lucas Almeida',         email: 'lucas.almeida@empresa.com.br' },
  { name: 'Gabriela Teixeira',     email: 'gabi.teixeira@email.com' },
];

const STATUSES = [
  'formulario',
  'documentacao',
  'entrevista',
  'visita',
  'aprovacao_final',
  'aprovado',
  'rejeitado',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function escape(str) {
  return str.replace(/'/g, "''");
}

function runSql(sql) {
  const result = spawnSync(
    'supabase',
    ['db', 'query', '--linked', sql],
    {
      encoding: 'utf-8',
      env: { ...process.env, PATH: `${process.env.HOME}/bin:${process.env.PATH}` },
    },
  );

  if (result.status !== 0) {
    console.error('SQL error:', result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }

  return (result.stdout || '').trim();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  if (RESET) {
    console.log('🗑  Limpando dados existentes...');
    runSql('DELETE FROM adoption_requests;');
    runSql('DELETE FROM pets;');
    console.log('   ✓ Dados removidos.');
  }

  // 1. Inserir pets
  console.log('\n🐾 Inserindo pets...');
  const petIds = [];

  for (const pet of PETS) {
    const sql = `
      INSERT INTO pets (name, species, sex, size, age_months, city, photo_url)
      VALUES (
        '${escape(pet.name)}',
        '${pet.species}',
        '${pet.sex}',
        '${pet.size}',
        ${pet.age_months},
        '${escape(pet.city)}',
        '${escape(pet.photo)}'
      )
      RETURNING id;
    `;

    const output = runSql(sql);
    const match = output.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);

    if (!match) {
      console.error(`Não foi possível obter o ID do pet "${pet.name}". Output: ${output}`);
      process.exit(1);
    }

    const id = match[0];
    petIds.push(id);
    console.log(`   ✓ ${pet.name} (${pet.species}) → ${id}`);
  }

  // 2. Inserir solicitações de adoção
  console.log('\n📋 Inserindo solicitações de adoção...');

  // Gerar datas espalhadas nos últimos 90 dias
  const now = Date.now();
  const DAY_MS = 86400000;

  for (let i = 0; i < 15; i++) {
    const adopter = pick(ADOPTERS);
    const petId = pick(petIds);
    const status = pick(STATUSES);
    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = new Date(now - daysAgo * DAY_MS).toISOString();

    const sql = `
      INSERT INTO adoption_requests (adopter_id, adopter_name, adopter_email, pet_id, status, created_at)
      VALUES (
        gen_random_uuid(),
        '${escape(adopter.name)}',
        '${escape(adopter.email)}',
        '${petId}',
        '${status}',
        '${createdAt}'
      )
      RETURNING id;
    `;

    const output = runSql(sql);
    const match = output.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    const requestId = match ? match[0] : '?';
    console.log(`   ✓ ${adopter.name} → pet ${petId.slice(0, 8)}... [${status}] → ${requestId}`);
  }

  console.log('\n✅ Seed concluído com sucesso!');
  console.log(`   ${PETS.length} pets inseridos`);
  console.log('   15 solicitações inseridas');
  console.log('\nAcesse o painel em http://localhost:3000/solicitacoes');
}

main();
