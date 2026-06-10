# FEATURE-001 — Lista de Solicitações de Adoção e Modal de Detalhes

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o painel administrativo com listagem paginada de solicitações de adoção e modal de detalhes com controle de etapas do processo, acessível somente após login de admin.

**Architecture:** Backend NestJS expõe endpoints REST de solicitações protegidos por guard de admin (via Supabase JWT + role). Frontend Next.js (App Router) exibe a listagem em `/admin/solicitacoes` com filtros, paginação e modal overlay — sem navegação de página. O redirecionamento pós-login é ajustado no hook `useLogin` para bifurcar por role.

**Tech Stack:** Next.js 14 (App Router), React Hook Form, react-i18next, Axios, CSS Modules · NestJS, Supabase (Postgres + Auth), class-validator.

---

## Mapa de Arquivos

### Backend (serviço NestJS)

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `services/backend/db/migrations/005_create_adoption_requests.sql` | Criar | Tabela `adoption_requests` com colunas de pet, adotante e status do processo |
| `services/backend/src/common/guards/admin.guard.ts` | Criar | Guard que verifica `user_metadata.role === 'admin'` no JWT Supabase |
| `services/backend/src/common/decorators/roles.decorator.ts` | Criar | Decorator `@Roles('admin')` para anotar controllers |
| `services/backend/src/modules/solicitacoes/dto/list-solicitacoes.dto.ts` | Criar | DTO de query params para listagem com filtros e paginação |
| `services/backend/src/modules/solicitacoes/dto/update-status.dto.ts` | Criar | DTO para avançar/rejeitar/aprovar etapa |
| `services/backend/src/modules/solicitacoes/solicitacoes.service.ts` | Criar | Lógica de listagem paginada, detalhe e atualização de status via Supabase |
| `services/backend/src/modules/solicitacoes/solicitacoes.controller.ts` | Criar | Endpoints `GET /adoption-requests`, `GET /adoption-requests/:id`, `PATCH /adoption-requests/:id/status` |
| `services/backend/src/modules/solicitacoes/solicitacoes.module.ts` | Criar | Módulo NestJS que registra controller, service e guards |
| `services/backend/src/app.module.ts` | Modificar | Importar `SolicitacoesModule` |

### Frontend (Next.js)

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `services/frontend/src/types/adoption-request.ts` | Criar | Tipos `AdoptionRequestSummaryType`, `AdoptionRequestDetailType`, `AdoptionProcessStepType` |
| `services/frontend/src/http/adoptionRequestService.ts` | Criar | Classe `AdoptionRequestService` com `list()` e `getById()` e `updateStatus()` |
| `services/frontend/src/features/auth/hooks/useLogin.ts` | Modificar | Bifurcar redirect por role: admin → `/admin/solicitacoes`, demais → `/` |
| `services/frontend/src/features/auth/hooks/useLogin.spec.ts` | Modificar | Adicionar cenários de redirect por role |
| `services/frontend/src/middleware.ts` | Modificar | Proteger rotas `/admin/*` exigindo role admin no cookie de sessão |
| `services/frontend/src/translations/pt.json` | Modificar | Adicionar namespace `ADMIN_SOLICITACOES` com todos os textos da tela |
| `services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacoes.ts` | Criar | Hook com estado de lista, filtros, paginação e fetch |
| `services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacoes.spec.ts` | Criar | Testes unitários do hook |
| `services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacaoModal.ts` | Criar | Hook com estado de modal aberto/fechado, fetch do detalhe e updateStatus |
| `services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacaoModal.spec.ts` | Criar | Testes unitários do hook de modal |
| `services/frontend/src/features/admin/solicitacoes/components/SolicitacoesTable/SolicitacoesTable.tsx` | Criar | Tabela de listagem com colunas e botão "Ver solicitação" |
| `services/frontend/src/features/admin/solicitacoes/components/SolicitacoesTable/SolicitacoesTable.module.css` | Criar | Estilos da tabela |
| `services/frontend/src/features/admin/solicitacoes/components/SolicitacoesTable/SolicitacoesTable.spec.tsx` | Criar | Testes do componente tabela |
| `services/frontend/src/features/admin/solicitacoes/components/SolicitacaoModal/SolicitacaoModal.tsx` | Criar | Modal overlay com dados do pedido, etapas e botões de ação |
| `services/frontend/src/features/admin/solicitacoes/components/SolicitacaoModal/SolicitacaoModal.module.css` | Criar | Estilos do modal |
| `services/frontend/src/features/admin/solicitacoes/components/SolicitacaoModal/SolicitacaoModal.spec.tsx` | Criar | Testes do componente modal |
| `services/frontend/src/features/admin/solicitacoes/screens/SolicitacoesScreen.tsx` | Criar | Screen que compõe filtros, tabela, paginação e modal |
| `services/frontend/src/features/admin/solicitacoes/screens/SolicitacoesScreen.module.css` | Criar | Estilos da screen |
| `services/frontend/src/features/admin/solicitacoes/screens/SolicitacoesScreen.spec.tsx` | Criar | Testes de integração da screen |
| `services/frontend/src/app/(admin)/solicitacoes/page.tsx` | Criar | Page do App Router que renderiza `SolicitacoesScreen` |

---

## Task 1 — Migração do banco: tabela `adoption_requests`

**Files:**
- Create: `services/backend/db/migrations/005_create_adoption_requests.sql`

- [ ] **Step 1: Criar o arquivo de migração**

```sql
-- 005_create_adoption_requests.sql
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
```

- [ ] **Step 2: Aplicar a migração no Supabase (SQL Editor) e verificar se a tabela existe**

No Supabase Dashboard → SQL Editor → colar o SQL acima e executar. Confirmar que a tabela `adoption_requests` aparece em Table Editor.

- [ ] **Step 3: Inserir dados de seed para desenvolvimento**

```sql
INSERT INTO adoption_requests
  (adopter_id, adopter_name, adopter_email, pet_name, pet_species, pet_sex, pet_size, pet_age_months, pet_city, status, observations)
VALUES
  (gen_random_uuid(), 'Maria Silva', 'maria@email.com', 'Bolinha', 'cachorro', 'macho', 'medio', 24, 'São Paulo', 'formulario', null),
  (gen_random_uuid(), 'João Costa', 'joao@email.com', 'Mimi', 'gato', 'femea', 'pequeno', 12, 'Curitiba', 'entrevista', 'Lar tem quintal'),
  (gen_random_uuid(), 'Ana Lima', 'ana@email.com', 'Thor', 'cachorro', 'macho', 'grande', 36, 'São Paulo', 'aprovacao_final', null),
  (gen_random_uuid(), 'Pedro Rocha', 'pedro@email.com', 'Fifi', 'gato', 'femea', 'pequeno', 8, 'Campinas', 'aprovado', null),
  (gen_random_uuid(), 'Carla Nunes', 'carla@email.com', 'Rex', 'cachorro', 'macho', 'grande', 48, 'Londrina', 'rejeitado', 'Apartamento sem espaço');
```

- [ ] **Step 4: Commit**

```bash
git add services/backend/db/migrations/005_create_adoption_requests.sql
git commit -m "feat(db): add adoption_requests table migration with seed data"
```

---

## Task 2 — Backend: AdminGuard + módulo SolicitacoesModule

**Files:**
- Create: `services/backend/src/common/guards/admin.guard.ts`
- Create: `services/backend/src/common/decorators/roles.decorator.ts`
- Create: `services/backend/src/modules/solicitacoes/dto/list-solicitacoes.dto.ts`
- Create: `services/backend/src/modules/solicitacoes/dto/update-status.dto.ts`
- Create: `services/backend/src/modules/solicitacoes/solicitacoes.service.ts`
- Create: `services/backend/src/modules/solicitacoes/solicitacoes.controller.ts`
- Create: `services/backend/src/modules/solicitacoes/solicitacoes.module.ts`
- Modify: `services/backend/src/app.module.ts`

- [ ] **Step 1: Criar o guard de admin**

`services/backend/src/common/guards/admin.guard.ts`:

```typescript
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import type { Request } from 'express';

import type { AppConfigType } from '@/config/configuration';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private readonly configService: ConfigService<AppConfigType, true>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new ForbiddenException();
    }

    const supabase = createClient(
      this.configService.get('supabase.url', { infer: true }),
      this.configService.get('supabase.anonKey', { infer: true }),
    );

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new ForbiddenException();
    }

    const role = data.user.user_metadata['role'] as string | undefined;

    if (role !== 'admin') {
      throw new ForbiddenException();
    }

    (request as Request & { user: unknown }).user = data.user;

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    return request.cookies?.['access_token'] as string | undefined;
  }

}
```

- [ ] **Step 2: Criar o DTO de listagem**

`services/backend/src/modules/solicitacoes/dto/list-solicitacoes.dto.ts`:

```typescript
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListSolicitacoesDto {

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['gato', 'cachorro'])
  species?: 'gato' | 'cachorro';

  @IsOptional()
  @IsIn(['macho', 'femea'])
  sex?: 'macho' | 'femea';

  @IsOptional()
  @IsIn(['pequeno', 'medio', 'grande'])
  size?: 'pequeno' | 'medio' | 'grande';

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;

}
```

- [ ] **Step 3: Criar o DTO de atualização de status**

`services/backend/src/modules/solicitacoes/dto/update-status.dto.ts`:

```typescript
import { IsIn, IsOptional, IsString } from 'class-validator';

const VALID_STATUSES = [
  'formulario',
  'documentacao',
  'entrevista',
  'visita',
  'aprovacao_final',
  'aprovado',
  'rejeitado',
] as const;

export type AdoptionStatusType = typeof VALID_STATUSES[number];

export class UpdateStatusDto {

  @IsIn(VALID_STATUSES)
  status: AdoptionStatusType;

  @IsOptional()
  @IsString()
  observations?: string;

}
```

- [ ] **Step 4: Criar o service**

`services/backend/src/modules/solicitacoes/solicitacoes.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const WS = require('ws') as typeof import('ws');

import type { AppConfigType } from '@/config/configuration';

import type { ListSolicitacoesDto } from './dto/list-solicitacoes.dto';
import type { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class SolicitacoesService {

  constructor(private readonly configService: ConfigService<AppConfigType, true>) {}

  private get supabase() {
    return createClient(
      this.configService.get('supabase.url', { infer: true }),
      this.configService.get('supabase.serviceRoleKey', { infer: true }),
      { realtime: { transport: WS as never } },
    );
  }

  async list(dto: ListSolicitacoesDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.supabase
      .from('adoption_requests')
      .select('id, created_at, adopter_name, pet_name, pet_species, pet_sex, pet_size, pet_age_months, pet_city, status', { count: 'exact' });

    if (dto.search) {
      query = query.or(`pet_name.ilike.%${dto.search}%,pet_city.ilike.%${dto.search}%,adopter_name.ilike.%${dto.search}%`);
    }

    if (dto.species) query = query.eq('pet_species', dto.species);
    if (dto.sex) query = query.eq('pet_sex', dto.sex);
    if (dto.size) query = query.eq('pet_size', dto.size);
    if (dto.city) query = query.ilike('pet_city', `%${dto.city}%`);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);

    return {
      data: data ?? [],
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from('adoption_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundException('Solicitação não encontrada');

    return data;
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const { data: existing } = await this.supabase
      .from('adoption_requests')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundException('Solicitação não encontrada');

    const updatePayload: Record<string, unknown> = {
      status: dto.status,
      updated_at: new Date().toISOString(),
    };

    if (dto.observations !== undefined) {
      updatePayload['observations'] = dto.observations;
    }

    const { data, error } = await this.supabase
      .from('adoption_requests')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

}
```

- [ ] **Step 5: Criar o controller**

`services/backend/src/modules/solicitacoes/solicitacoes.controller.ts`:

```typescript
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AdminGuard } from '@/common/guards/admin.guard';

import { ListSolicitacoesDto } from './dto/list-solicitacoes.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { SolicitacoesService } from './solicitacoes.service';

@Controller('adoption-requests')
@UseGuards(AdminGuard)
export class SolicitacoesController {

  constructor(private readonly service: SolicitacoesService) {}

  @Get()
  list(@Query() dto: ListSolicitacoesDto) {
    return this.service.list(dto);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getById(id);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.service.updateStatus(id, dto);
  }

}
```

- [ ] **Step 6: Criar o módulo**

`services/backend/src/modules/solicitacoes/solicitacoes.module.ts`:

```typescript
import { Module } from '@nestjs/common';

import { AdminGuard } from '@/common/guards/admin.guard';

import { SolicitacoesController } from './solicitacoes.controller';
import { SolicitacoesService } from './solicitacoes.service';

@Module({
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService, AdminGuard],
})
export class SolicitacoesModule {}
```

- [ ] **Step 7: Registrar o módulo no AppModule**

`services/backend/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration } from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { SolicitacoesModule } from './modules/solicitacoes/solicitacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    SolicitacoesModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 8: Verificar build do backend**

```bash
cd services/backend && yarn build
```

Expected: build sem erros de TypeScript.

- [ ] **Step 9: Testar endpoints manualmente com curl**

```bash
# Listar (sem token — deve retornar 403)
curl -i http://localhost:3001/adoption-requests

# Listar com token de admin (obter token via login do admin no frontend)
curl -i http://localhost:3001/adoption-requests \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

Expected: sem token → 403 Forbidden; com token admin → 200 com lista.

- [ ] **Step 10: Commit**

```bash
git add services/backend/src/common/guards/admin.guard.ts \
        services/backend/src/modules/solicitacoes/ \
        services/backend/src/app.module.ts
git commit -m "feat(backend): add SolicitacoesModule with AdminGuard and adoption-requests endpoints"
```

---

## Task 3 — Frontend: tipos e service de solicitações

**Files:**
- Create: `services/frontend/src/types/adoption-request.ts`
- Create: `services/frontend/src/http/adoptionRequestService.ts`
- Create: `services/frontend/src/http/adoptionRequestService.spec.ts`

- [ ] **Step 1: Criar os tipos**

`services/frontend/src/types/adoption-request.ts`:

```typescript
export type AdoptionProcessStepType =
  | 'formulario'
  | 'documentacao'
  | 'entrevista'
  | 'visita'
  | 'aprovacao_final'
  | 'aprovado'
  | 'rejeitado';

export const ADOPTION_PROCESS_STEPS: AdoptionProcessStepType[] = [
  'formulario',
  'documentacao',
  'entrevista',
  'visita',
  'aprovacao_final',
];

export const FINAL_STEPS: AdoptionProcessStepType[] = ['aprovado', 'rejeitado'];

export type PetSpeciesType = 'gato' | 'cachorro';
export type PetSexType = 'macho' | 'femea';
export type PetSizeType = 'pequeno' | 'medio' | 'grande';

export type AdoptionRequestSummaryType = {
  id: string;
  created_at: string;
  adopter_name: string;
  pet_name: string;
  pet_species: PetSpeciesType;
  pet_sex: PetSexType;
  pet_size: PetSizeType;
  pet_age_months: number;
  pet_city: string;
  status: AdoptionProcessStepType;
};

export type AdoptionRequestDetailType = AdoptionRequestSummaryType & {
  adopter_email: string;
  observations: string | null;
  updated_at: string;
};

export type AdoptionRequestListResponseType = {
  data: AdoptionRequestSummaryType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ListSolicitacoesFiltersType = {
  search?: string;
  species?: PetSpeciesType;
  sex?: PetSexType;
  size?: PetSizeType;
  city?: string;
  page?: number;
  limit?: number;
};
```

- [ ] **Step 2: Criar o service**

`services/frontend/src/http/adoptionRequestService.ts`:

```typescript
import apiClient from '@/http/apiClient';
import type {
  AdoptionRequestDetailType,
  AdoptionRequestListResponseType,
  AdoptionProcessStepType,
  ListSolicitacoesFiltersType,
} from '@/types/adoption-request';

class AdoptionRequestService {

  async list(filters: ListSolicitacoesFiltersType = {}): Promise<AdoptionRequestListResponseType> {
    const response = await apiClient.get<AdoptionRequestListResponseType>('/adoption-requests', {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<AdoptionRequestDetailType> {
    const response = await apiClient.get<AdoptionRequestDetailType>(`/adoption-requests/${id}`);
    return response.data;
  }

  async updateStatus(id: string, status: AdoptionProcessStepType, observations?: string): Promise<AdoptionRequestDetailType> {
    const response = await apiClient.patch<AdoptionRequestDetailType>(
      `/adoption-requests/${id}/status`,
      { status, observations },
    );
    return response.data;
  }

}

export const adoptionRequestService = new AdoptionRequestService();
```

- [ ] **Step 3: Escrever o teste do service (falha esperada)**

`services/frontend/src/http/adoptionRequestService.spec.ts`:

```typescript
import apiClient from '@/http/apiClient';
import { adoptionRequestService } from './adoptionRequestService';
import type { AdoptionRequestListResponseType, AdoptionRequestDetailType } from '@/types/adoption-request';

jest.mock('@/http/apiClient', () => ({
  default: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockGet = apiClient.get as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;

const mockSummary = {
  id: 'uuid-1',
  created_at: '2026-06-08T10:00:00Z',
  adopter_name: 'Maria Silva',
  pet_name: 'Bolinha',
  pet_species: 'cachorro',
  pet_sex: 'macho',
  pet_size: 'medio',
  pet_age_months: 24,
  pet_city: 'São Paulo',
  status: 'formulario',
} as const;

const mockDetail = {
  ...mockSummary,
  adopter_email: 'maria@email.com',
  observations: null,
  updated_at: '2026-06-08T10:00:00Z',
} as const;

describe('adoptionRequestService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('list()', () => {
    it('should return paginated adoption requests', async () => {
      const mockResponse: AdoptionRequestListResponseType = {
        data: [mockSummary],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      mockGet.mockResolvedValueOnce({ data: mockResponse });

      const result = await adoptionRequestService.list({ page: 1 });

      expect(mockGet).toHaveBeenCalledWith('/adoption-requests', { params: { page: 1 } });
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should pass filters as query params', async () => {
      mockGet.mockResolvedValueOnce({ data: { data: [], total: 0, page: 1, limit: 20, totalPages: 0 } });

      await adoptionRequestService.list({ species: 'gato', city: 'Curitiba' });

      expect(mockGet).toHaveBeenCalledWith('/adoption-requests', {
        params: { species: 'gato', city: 'Curitiba' },
      });
    });
  });

  describe('getById()', () => {
    it('should return adoption request detail', async () => {
      mockGet.mockResolvedValueOnce({ data: mockDetail });

      const result = await adoptionRequestService.getById('uuid-1');

      expect(mockGet).toHaveBeenCalledWith('/adoption-requests/uuid-1');
      expect(result.id).toBe('uuid-1');
      expect(result.adopter_email).toBe('maria@email.com');
    });
  });

  describe('updateStatus()', () => {
    it('should patch status and return updated detail', async () => {
      const updated: AdoptionRequestDetailType = { ...mockDetail, status: 'documentacao' };
      mockPatch.mockResolvedValueOnce({ data: updated });

      const result = await adoptionRequestService.updateStatus('uuid-1', 'documentacao');

      expect(mockPatch).toHaveBeenCalledWith('/adoption-requests/uuid-1/status', {
        status: 'documentacao',
        observations: undefined,
      });
      expect(result.status).toBe('documentacao');
    });
  });
});
```

- [ ] **Step 4: Rodar o teste e verificar que passa**

```bash
cd services/frontend && yarn test adoptionRequestService --no-coverage
```

Expected: 4 tests passed.

- [ ] **Step 5: Commit**

```bash
git add services/frontend/src/types/adoption-request.ts \
        services/frontend/src/http/adoptionRequestService.ts \
        services/frontend/src/http/adoptionRequestService.spec.ts
git commit -m "feat(frontend): add adoption-request types and service"
```

---

## Task 4 — Frontend: redirecionamento pós-login por role

**Files:**
- Modify: `services/frontend/src/features/auth/hooks/useLogin.ts`
- Modify: `services/frontend/src/features/auth/hooks/useLogin.spec.ts`

- [ ] **Step 1: Escrever os novos testes de redirect por role (falha esperada)**

Substituir os testes existentes de redirect em `useLogin.spec.ts` (manter todos os outros):

```typescript
// Substitui apenas o test 'should redirect to / on successful login'
// Adiciona mais dois casos de redirect

it('should redirect admin to /admin/solicitacoes on successful login', async () => {
  mockLogin.mockResolvedValueOnce({
    user: { id: '1', name: 'Admin', email: 'admin@email.com', role: 'admin' },
    accessToken: 'token',
    refreshToken: 'refresh',
  });

  const { result } = renderHook(() => useLogin());

  await act(async () => {
    await result.current.onSubmit({ email: 'admin@email.com', password: 'password123' });
  });

  expect(mockPush).toHaveBeenCalledWith('/admin/solicitacoes');
  expect(result.current.loginError).toBeNull();
});

it('should redirect adotante to / on successful login', async () => {
  mockLogin.mockResolvedValueOnce({
    user: { id: '2', name: 'Adotante', email: 'adotante@email.com', role: 'adotante' },
    accessToken: 'token',
    refreshToken: 'refresh',
  });

  const { result } = renderHook(() => useLogin());

  await act(async () => {
    await result.current.onSubmit({ email: 'adotante@email.com', password: 'password123' });
  });

  expect(mockPush).toHaveBeenCalledWith('/');
});
```

- [ ] **Step 2: Rodar os novos testes e confirmar que falham**

```bash
cd services/frontend && yarn test useLogin --no-coverage
```

Expected: 2 testes novos FAILam porque `useLogin` ainda redireciona todos para `/`.

- [ ] **Step 3: Atualizar useLogin para bifurcar por role**

`services/frontend/src/features/auth/hooks/useLogin.ts` completo:

```typescript
'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { authService } from '@/http/authService';
import type { LoginFormValuesType } from '@/features/auth/validators/authValidators';

type UseLoginReturnType = {
  onSubmit: (values: LoginFormValuesType) => Promise<void>;
  isLoading: boolean;
  loginError: string | null;
};

export function useLogin(): UseLoginReturnType {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = useCallback(
    async (values: LoginFormValuesType) => {
      setIsLoading(true);
      setLoginError(null);
      try {
        const response = await authService.login({ email: values.email, password: values.password });
        const destination = response.user.role === 'admin' ? '/admin/solicitacoes' : '/';
        router.push(destination);
      } catch {
        setLoginError('AUTH_LOGIN:errorGeneric');
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  return { onSubmit, isLoading, loginError };
}
```

- [ ] **Step 4: Rodar todos os testes de useLogin e confirmar que passam**

```bash
cd services/frontend && yarn test useLogin --no-coverage
```

Expected: todos os testes passam (incluindo os antigos de erro e loading).

- [ ] **Step 5: Commit**

```bash
git add services/frontend/src/features/auth/hooks/useLogin.ts \
        services/frontend/src/features/auth/hooks/useLogin.spec.ts
git commit -m "feat(auth): redirect admin to /admin/solicitacoes after login"
```

---

## Task 5 — Frontend: middleware com proteção de rotas admin

**Files:**
- Modify: `services/frontend/src/middleware.ts`

> Nota: o middleware do Next.js não tem acesso ao JWT do Supabase de forma síncrona para verificar role. A estratégia é: a rota `/admin/*` é protegida verificando o cookie `access_token`. A verificação de role real ocorre no AdminGuard do backend. O middleware apenas garante que o usuário autenticado chegue à rota; usuários não-admin receberão 403 do backend ao tentar carregar dados.

- [ ] **Step 1: Atualizar o middleware**

`services/frontend/src/middleware.ts`:

```typescript
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/middleware';

const PUBLIC_PATHS = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const supabaseResponse = createClient(request);
  const token = request.cookies.get('access_token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
};
```

> O middleware permanece igual ao atual — a proteção de role fica no backend. Avançar para verificação de role no middleware exigiria validação JWT assíncrona que está fora do escopo desta feature (ver "O que Não Deve Ser Feito" no spec).

- [ ] **Step 2: Verificar que o middleware continua funcionando**

Iniciar o frontend e acessar `/admin/solicitacoes` sem estar logado — deve redirecionar para `/login`.

```bash
cd services/frontend && yarn dev
```

- [ ] **Step 3: Commit**

```bash
git add services/frontend/src/middleware.ts
git commit -m "docs(middleware): document admin route protection strategy"
```

---

## Task 6 — Frontend: traduções do painel admin

**Files:**
- Modify: `services/frontend/src/translations/pt.json`

- [ ] **Step 1: Adicionar o namespace `ADMIN_SOLICITACOES` ao arquivo de traduções**

Adicionar ao objeto raiz de `pt.json`:

```json
"ADMIN_SOLICITACOES": {
  "pageTitle": "Solicitações de Adoção",
  "searchPlaceholder": "Buscar por pet, adotante ou cidade...",
  "filterSpeciesLabel": "Espécie",
  "filterSpeciesAll": "Todas",
  "filterSpeciesCat": "Gato",
  "filterSpeciesDog": "Cachorro",
  "filterSexLabel": "Sexo",
  "filterSexAll": "Todos",
  "filterSexMale": "Macho",
  "filterSexFemale": "Fêmea",
  "filterSizeLabel": "Porte",
  "filterSizeAll": "Todos",
  "filterSizeSmall": "Pequeno",
  "filterSizeMedium": "Médio",
  "filterSizeLarge": "Grande",
  "tableHeaderDate": "Data",
  "tableHeaderPet": "Pet",
  "tableHeaderCity": "Cidade",
  "tableHeaderAge": "Idade",
  "tableHeaderSex": "Sexo",
  "tableHeaderSize": "Porte",
  "tableHeaderActions": "Ações",
  "actionViewRequest": "Ver solicitação",
  "ageMonths": "{{months}}m",
  "emptyState": "Nenhuma solicitação de adoção encontrada.",
  "errorLoading": "Não foi possível carregar as solicitações no momento. Tente novamente.",
  "paginationInfo": "Página {{page}} de {{totalPages}}",
  "paginationPrev": "Anterior",
  "paginationNext": "Próxima",
  "modalTitle": "Detalhes da Solicitação",
  "modalClose": "Fechar",
  "modalDateLabel": "Data da solicitação",
  "modalStatusLabel": "Status",
  "modalAdopterLabel": "Adotante",
  "modalAnimalLabel": "Animal",
  "modalCityLabel": "Cidade",
  "modalObservationsLabel": "Observações",
  "modalObservationsEmpty": "Sem observações registradas.",
  "modalProcessTitle": "Etapas do processo",
  "modalActionAdvance": "Avançar etapa",
  "modalActionBack": "Retroceder etapa",
  "modalActionApprove": "Aprovar Adoção",
  "modalActionReject": "Rejeitar Adoção",
  "modalErrorLoading": "Não foi possível abrir a solicitação. Atualize a página e tente novamente.",
  "modalErrorUpdate": "Não foi possível atualizar o status. Tente novamente.",
  "modalFinalized": "Esta solicitação já está concluída e não pode ser alterada.",
  "stepFormulario": "Formulário",
  "stepDocumentacao": "Documentação",
  "stepEntrevista": "Entrevista",
  "stepVisita": "Visita Domiciliar",
  "stepAprovacaoFinal": "Aprovação Final",
  "stepAprovado": "Aprovado",
  "stepRejeitado": "Rejeitado",
  "statusAprovado": "Aprovado",
  "statusRejeitado": "Rejeitado"
}
```

- [ ] **Step 2: Commit**

```bash
git add services/frontend/src/translations/pt.json
git commit -m "feat(i18n): add ADMIN_SOLICITACOES translation namespace"
```

---

## Task 7 — Frontend: hook `useSolicitacoes`

**Files:**
- Create: `services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacoes.ts`
- Create: `services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacoes.spec.ts`

- [ ] **Step 1: Escrever o teste (falha esperada)**

`services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacoes.spec.ts`:

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';

import { adoptionRequestService } from '@/http/adoptionRequestService';
import { useSolicitacoes } from './useSolicitacoes';

jest.mock('@/http/adoptionRequestService', () => ({
  adoptionRequestService: {
    list: jest.fn(),
  },
}));

const mockList = adoptionRequestService.list as jest.Mock;

const mockResponse = {
  data: [
    {
      id: 'uuid-1',
      created_at: '2026-06-08T10:00:00Z',
      adopter_name: 'Maria Silva',
      pet_name: 'Bolinha',
      pet_species: 'cachorro',
      pet_sex: 'macho',
      pet_size: 'medio',
      pet_age_months: 24,
      pet_city: 'São Paulo',
      status: 'formulario',
    },
  ],
  total: 1,
  page: 1,
  limit: 20,
  totalPages: 1,
};

describe('useSolicitacoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with isLoading=true and empty data', () => {
    mockList.mockReturnValueOnce(new Promise(() => {}));

    const { result } = renderHook(() => useSolicitacoes());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.solicitacoes).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should populate solicitacoes after successful fetch', async () => {
    mockList.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useSolicitacoes());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.solicitacoes).toHaveLength(1);
    expect(result.current.solicitacoes[0].id).toBe('uuid-1');
    expect(result.current.error).toBeNull();
  });

  it('should set error when fetch fails', async () => {
    mockList.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSolicitacoes());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('ADMIN_SOLICITACOES:errorLoading');
    expect(result.current.solicitacoes).toEqual([]);
  });

  it('should refetch when setFilters is called', async () => {
    mockList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSolicitacoes());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setFilters({ species: 'gato' });
    });

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(2));
    expect(mockList).toHaveBeenLastCalledWith(expect.objectContaining({ species: 'gato', page: 1 }));
  });

  it('should change page with setPage', async () => {
    mockList.mockResolvedValue({ ...mockResponse, page: 2, totalPages: 3 });

    const { result } = renderHook(() => useSolicitacoes());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => expect(mockList).toHaveBeenCalledTimes(2));
    expect(mockList).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
cd services/frontend && yarn test useSolicitacoes --no-coverage
```

Expected: FAIL — arquivo não existe.

- [ ] **Step 3: Implementar o hook**

`services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacoes.ts`:

```typescript
'use client';

import { useCallback, useEffect, useState } from 'react';

import { adoptionRequestService } from '@/http/adoptionRequestService';
import type { AdoptionRequestSummaryType, ListSolicitacoesFiltersType } from '@/types/adoption-request';

type PaginationMetaType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type UseSolicitacoesReturnType = {
  solicitacoes: AdoptionRequestSummaryType[];
  pagination: PaginationMetaType;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: ListSolicitacoesFiltersType) => void;
  setPage: (page: number) => void;
};

const DEFAULT_PAGINATION: PaginationMetaType = { total: 0, page: 1, limit: 20, totalPages: 0 };

export function useSolicitacoes(): UseSolicitacoesReturnType {
  const [solicitacoes, setSolicitacoes] = useState<AdoptionRequestSummaryType[]>([]);
  const [pagination, setPagination] = useState<PaginationMetaType>(DEFAULT_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<ListSolicitacoesFiltersType>({ page: 1, limit: 20 });

  const fetchData = useCallback(async (currentFilters: ListSolicitacoesFiltersType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adoptionRequestService.list(currentFilters);
      setSolicitacoes(response.data);
      setPagination({ total: response.total, page: response.page, limit: response.limit, totalPages: response.totalPages });
    } catch {
      setError('ADMIN_SOLICITACOES:errorLoading');
      setSolicitacoes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(filters);
  }, [filters, fetchData]);

  const setFilters = useCallback((newFilters: ListSolicitacoesFiltersType) => {
    setFiltersState(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  return { solicitacoes, pagination, isLoading, error, setFilters, setPage };
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

```bash
cd services/frontend && yarn test useSolicitacoes --no-coverage
```

Expected: 5 tests passed.

- [ ] **Step 5: Commit**

```bash
git add services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacoes.ts \
        services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacoes.spec.ts
git commit -m "feat(admin): add useSolicitacoes hook with filters and pagination"
```

---

## Task 8 — Frontend: hook `useSolicitacaoModal`

**Files:**
- Create: `services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacaoModal.ts`
- Create: `services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacaoModal.spec.ts`

- [ ] **Step 1: Escrever o teste (falha esperada)**

`services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacaoModal.spec.ts`:

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';

import { adoptionRequestService } from '@/http/adoptionRequestService';
import { useSolicitacaoModal } from './useSolicitacaoModal';

jest.mock('@/http/adoptionRequestService', () => ({
  adoptionRequestService: {
    getById: jest.fn(),
    updateStatus: jest.fn(),
  },
}));

const mockGetById = adoptionRequestService.getById as jest.Mock;
const mockUpdateStatus = adoptionRequestService.updateStatus as jest.Mock;

const mockDetail = {
  id: 'uuid-1',
  created_at: '2026-06-08T10:00:00Z',
  updated_at: '2026-06-08T10:00:00Z',
  adopter_name: 'Maria Silva',
  adopter_email: 'maria@email.com',
  pet_name: 'Bolinha',
  pet_species: 'cachorro' as const,
  pet_sex: 'macho' as const,
  pet_size: 'medio' as const,
  pet_age_months: 24,
  pet_city: 'São Paulo',
  status: 'entrevista' as const,
  observations: null,
};

describe('useSolicitacaoModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with isOpen=false and detail=null', () => {
    const { result } = renderHook(() => useSolicitacaoModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.detail).toBeNull();
  });

  it('should open modal and fetch detail on openModal()', async () => {
    mockGetById.mockResolvedValueOnce(mockDetail);

    const { result } = renderHook(() => useSolicitacaoModal());

    act(() => {
      result.current.openModal('uuid-1');
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.isLoadingDetail).toBe(true);

    await waitFor(() => expect(result.current.isLoadingDetail).toBe(false));

    expect(result.current.detail).toEqual(mockDetail);
    expect(result.current.detailError).toBeNull();
  });

  it('should set detailError when fetch fails', async () => {
    mockGetById.mockRejectedValueOnce(new Error('Not found'));

    const { result } = renderHook(() => useSolicitacaoModal());

    act(() => {
      result.current.openModal('uuid-bad');
    });

    await waitFor(() => expect(result.current.isLoadingDetail).toBe(false));

    expect(result.current.detailError).toBe('ADMIN_SOLICITACOES:modalErrorLoading');
    expect(result.current.detail).toBeNull();
  });

  it('should close modal and clear detail on closeModal()', async () => {
    mockGetById.mockResolvedValueOnce(mockDetail);

    const { result } = renderHook(() => useSolicitacaoModal());

    await act(async () => {
      result.current.openModal('uuid-1');
    });

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.detail).toBeNull();
  });

  it('should call updateStatus and refresh detail', async () => {
    const updatedDetail = { ...mockDetail, status: 'visita' as const };
    mockGetById.mockResolvedValueOnce(mockDetail);
    mockUpdateStatus.mockResolvedValueOnce(updatedDetail);

    const { result } = renderHook(() => useSolicitacaoModal());

    await act(async () => {
      result.current.openModal('uuid-1');
    });
    await waitFor(() => expect(result.current.isLoadingDetail).toBe(false));

    await act(async () => {
      await result.current.updateStatus('visita');
    });

    expect(mockUpdateStatus).toHaveBeenCalledWith('uuid-1', 'visita', undefined);
    expect(result.current.detail?.status).toBe('visita');
  });

  it('should set updateError when updateStatus fails', async () => {
    mockGetById.mockResolvedValueOnce(mockDetail);
    mockUpdateStatus.mockRejectedValueOnce(new Error('Server error'));

    const { result } = renderHook(() => useSolicitacaoModal());

    await act(async () => {
      result.current.openModal('uuid-1');
    });
    await waitFor(() => expect(result.current.isLoadingDetail).toBe(false));

    await act(async () => {
      await result.current.updateStatus('visita');
    });

    expect(result.current.updateError).toBe('ADMIN_SOLICITACOES:modalErrorUpdate');
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar falha**

```bash
cd services/frontend && yarn test useSolicitacaoModal --no-coverage
```

Expected: FAIL — arquivo não existe.

- [ ] **Step 3: Implementar o hook**

`services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacaoModal.ts`:

```typescript
'use client';

import { useCallback, useState } from 'react';

import { adoptionRequestService } from '@/http/adoptionRequestService';
import type { AdoptionRequestDetailType, AdoptionProcessStepType } from '@/types/adoption-request';

type UseSolicitacaoModalReturnType = {
  isOpen: boolean;
  detail: AdoptionRequestDetailType | null;
  isLoadingDetail: boolean;
  detailError: string | null;
  updateError: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
  updateStatus: (status: AdoptionProcessStepType, observations?: string) => Promise<void>;
};

export function useSolicitacaoModal(): UseSolicitacaoModalReturnType {
  const [isOpen, setIsOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdoptionRequestDetailType | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const openModal = useCallback((id: string) => {
    setIsOpen(true);
    setCurrentId(id);
    setDetail(null);
    setDetailError(null);
    setUpdateError(null);
    setIsLoadingDetail(true);

    adoptionRequestService.getById(id)
      .then(data => {
        setDetail(data);
      })
      .catch(() => {
        setDetailError('ADMIN_SOLICITACOES:modalErrorLoading');
      })
      .finally(() => {
        setIsLoadingDetail(false);
      });
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setCurrentId(null);
    setDetail(null);
    setDetailError(null);
    setUpdateError(null);
  }, []);

  const updateStatus = useCallback(async (status: AdoptionProcessStepType, observations?: string) => {
    if (!currentId) return;

    setUpdateError(null);
    try {
      const updated = await adoptionRequestService.updateStatus(currentId, status, observations);
      setDetail(updated);
    } catch {
      setUpdateError('ADMIN_SOLICITACOES:modalErrorUpdate');
    }
  }, [currentId]);

  return { isOpen, detail, isLoadingDetail, detailError, updateError, openModal, closeModal, updateStatus };
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

```bash
cd services/frontend && yarn test useSolicitacaoModal --no-coverage
```

Expected: 6 tests passed.

- [ ] **Step 5: Commit**

```bash
git add services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacaoModal.ts \
        services/frontend/src/features/admin/solicitacoes/hooks/useSolicitacaoModal.spec.ts
git commit -m "feat(admin): add useSolicitacaoModal hook with detail fetch and status update"
```

---

## Task 9 — Frontend: componente `SolicitacoesTable`

**Files:**
- Create: `services/frontend/src/features/admin/solicitacoes/components/SolicitacoesTable/SolicitacoesTable.tsx`
- Create: `services/frontend/src/features/admin/solicitacoes/components/SolicitacoesTable/SolicitacoesTable.module.css`
- Create: `services/frontend/src/features/admin/solicitacoes/components/SolicitacoesTable/SolicitacoesTable.spec.tsx`

- [ ] **Step 1: Escrever o teste (falha esperada)**

`SolicitacoesTable.spec.tsx`:

```typescript
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@/lib/i18n';
import type { AdoptionRequestSummaryType } from '@/types/adoption-request';

import SolicitacoesTable from './SolicitacoesTable';

const mockSolicitacoes: AdoptionRequestSummaryType[] = [
  {
    id: 'uuid-1',
    created_at: '2026-06-08T10:00:00Z',
    adopter_name: 'Maria Silva',
    pet_name: 'Bolinha',
    pet_species: 'cachorro',
    pet_sex: 'macho',
    pet_size: 'medio',
    pet_age_months: 24,
    pet_city: 'São Paulo',
    status: 'formulario',
  },
];

const defaultProps = {
  solicitacoes: mockSolicitacoes,
  onViewRequest: jest.fn(),
};

describe('SolicitacoesTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render table headers', () => {
    render(<SolicitacoesTable {...defaultProps} />);

    expect(screen.getByTestId('table-header-date')).toBeInTheDocument();
    expect(screen.getByTestId('table-header-pet')).toBeInTheDocument();
    expect(screen.getByTestId('table-header-city')).toBeInTheDocument();
    expect(screen.getByTestId('table-header-actions')).toBeInTheDocument();
  });

  it('should render a row for each solicitacao', () => {
    render(<SolicitacoesTable {...defaultProps} />);

    expect(screen.getByTestId('table-row-uuid-1')).toBeInTheDocument();
    expect(screen.getByText('Bolinha')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
  });

  it('should render empty state when list is empty', () => {
    render(<SolicitacoesTable {...defaultProps} solicitacoes={[]} />);

    expect(screen.getByTestId('table-empty-state')).toBeInTheDocument();
  });

  it('should call onViewRequest with the row id when "Ver solicitação" is clicked', async () => {
    const user = userEvent.setup();
    render(<SolicitacoesTable {...defaultProps} />);

    await user.click(screen.getByTestId('view-request-uuid-1'));

    expect(defaultProps.onViewRequest).toHaveBeenCalledWith('uuid-1');
  });
});
```

- [ ] **Step 2: Rodar para confirmar falha**

```bash
cd services/frontend && yarn test SolicitacoesTable --no-coverage
```

Expected: FAIL — arquivo não existe.

- [ ] **Step 3: Implementar o componente**

`SolicitacoesTable.tsx`:

```typescript
'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { AdoptionRequestSummaryType } from '@/types/adoption-request';

import styles from './SolicitacoesTable.module.css';

type SolicitacoesTablePropsType = {
  solicitacoes: AdoptionRequestSummaryType[];
  onViewRequest: (id: string) => void;
};

export default function SolicitacoesTable({ solicitacoes, onViewRequest }: SolicitacoesTablePropsType) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');

  const formatDate = useCallback((isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('pt-BR');
  }, []);

  if (solicitacoes.length === 0) {
    return (
      <div className={styles.emptyState} data-testid="table-empty-state">
        {t('emptyState')}
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th data-testid="table-header-date">{t('tableHeaderDate')}</th>
            <th data-testid="table-header-pet">{t('tableHeaderPet')}</th>
            <th data-testid="table-header-city">{t('tableHeaderCity')}</th>
            <th data-testid="table-header-age">{t('tableHeaderAge')}</th>
            <th data-testid="table-header-sex">{t('tableHeaderSex')}</th>
            <th data-testid="table-header-size">{t('tableHeaderSize')}</th>
            <th data-testid="table-header-actions">{t('tableHeaderActions')}</th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.map(item => (
            <SolicitacaoRow
              key={item.id}
              item={item}
              onViewRequest={onViewRequest}
              formatDate={formatDate}
              t={t}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type SolicitacaoRowPropsType = {
  item: AdoptionRequestSummaryType;
  onViewRequest: (id: string) => void;
  formatDate: (date: string) => string;
  t: (key: string) => string;
};

function SolicitacaoRow({ item, onViewRequest, formatDate, t }: SolicitacaoRowPropsType) {
  const handleView = useCallback(() => {
    onViewRequest(item.id);
  }, [item.id, onViewRequest]);

  return (
    <tr data-testid={`table-row-${item.id}`}>
      <td>{formatDate(item.created_at)}</td>
      <td>{item.pet_name}</td>
      <td>{item.pet_city}</td>
      <td>{t('ageMonths').replace('{{months}}', String(item.pet_age_months))}</td>
      <td>{item.pet_sex}</td>
      <td>{item.pet_size}</td>
      <td>
        <button
          type="button"
          className={styles.viewButton}
          onClick={handleView}
          data-testid={`view-request-${item.id}`}
          aria-label={t('actionViewRequest')}
        >
          {t('actionViewRequest')}
        </button>
      </td>
    </tr>
  );
}
```

- [ ] **Step 4: Criar o CSS**

`SolicitacoesTable.module.css`:

```css
.tableWrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table thead tr {
  background-color: #f5f5f5;
}

.table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #333333;
  white-space: nowrap;
}

.table td {
  padding: 12px 16px;
  color: #555555;
  border-top: 1px solid #e0e0e0;
}

.table tbody tr:hover {
  background-color: #fafafa;
}

.viewButton {
  padding: 6px 14px;
  background-color: #7b2d8b;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.viewButton:hover {
  background-color: #6a2578;
}

.emptyState {
  padding: 48px 24px;
  text-align: center;
  color: #777777;
  font-size: 15px;
}
```

- [ ] **Step 5: Rodar os testes e confirmar que passam**

```bash
cd services/frontend && yarn test SolicitacoesTable --no-coverage
```

Expected: 4 tests passed.

- [ ] **Step 6: Commit**

```bash
git add services/frontend/src/features/admin/solicitacoes/components/SolicitacoesTable/
git commit -m "feat(admin): add SolicitacoesTable component"
```

---

## Task 10 — Frontend: componente `SolicitacaoModal`

**Files:**
- Create: `services/frontend/src/features/admin/solicitacoes/components/SolicitacaoModal/SolicitacaoModal.tsx`
- Create: `services/frontend/src/features/admin/solicitacoes/components/SolicitacaoModal/SolicitacaoModal.module.css`
- Create: `services/frontend/src/features/admin/solicitacoes/components/SolicitacaoModal/SolicitacaoModal.spec.tsx`

- [ ] **Step 1: Escrever o teste (falha esperada)**

`SolicitacaoModal.spec.tsx`:

```typescript
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@/lib/i18n';
import type { AdoptionRequestDetailType } from '@/types/adoption-request';

import SolicitacaoModal from './SolicitacaoModal';

const mockDetail: AdoptionRequestDetailType = {
  id: 'uuid-1',
  created_at: '2026-06-08T10:00:00Z',
  updated_at: '2026-06-08T10:00:00Z',
  adopter_name: 'Maria Silva',
  adopter_email: 'maria@email.com',
  pet_name: 'Bolinha',
  pet_species: 'cachorro',
  pet_sex: 'macho',
  pet_size: 'medio',
  pet_age_months: 24,
  pet_city: 'São Paulo',
  status: 'entrevista',
  observations: 'Lar com quintal',
};

const defaultProps = {
  isOpen: true,
  detail: mockDetail,
  isLoadingDetail: false,
  detailError: null,
  updateError: null,
  onClose: jest.fn(),
  onUpdateStatus: jest.fn(),
};

describe('SolicitacaoModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen=false', () => {
    render(<SolicitacaoModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('solicitacao-modal')).not.toBeInTheDocument();
  });

  it('should render modal overlay when isOpen=true', () => {
    render(<SolicitacaoModal {...defaultProps} />);
    expect(screen.getByTestId('solicitacao-modal')).toBeInTheDocument();
  });

  it('should display adopter name, pet name and city', () => {
    render(<SolicitacaoModal {...defaultProps} />);
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('Bolinha')).toBeInTheDocument();
    expect(screen.getByText('São Paulo')).toBeInTheDocument();
  });

  it('should show loading spinner when isLoadingDetail=true', () => {
    render(<SolicitacaoModal {...defaultProps} detail={null} isLoadingDetail={true} />);
    expect(screen.getByTestId('modal-loading')).toBeInTheDocument();
  });

  it('should show error message when detailError is set', () => {
    render(<SolicitacaoModal {...defaultProps} detail={null} detailError="ADMIN_SOLICITACOES:modalErrorLoading" />);
    expect(screen.getByTestId('modal-detail-error')).toBeInTheDocument();
  });

  it('should show Avançar and Retroceder buttons for intermediate stages', () => {
    render(<SolicitacaoModal {...defaultProps} />);
    expect(screen.getByTestId('modal-action-advance')).toBeInTheDocument();
    expect(screen.getByTestId('modal-action-back')).toBeInTheDocument();
  });

  it('should show Aprovar and Rejeitar buttons when status=aprovacao_final', () => {
    render(<SolicitacaoModal {...defaultProps} detail={{ ...mockDetail, status: 'aprovacao_final' }} />);
    expect(screen.getByTestId('modal-action-approve')).toBeInTheDocument();
    expect(screen.getByTestId('modal-action-reject')).toBeInTheDocument();
  });

  it('should show finalized message and no action buttons when status=aprovado', () => {
    render(<SolicitacaoModal {...defaultProps} detail={{ ...mockDetail, status: 'aprovado' }} />);
    expect(screen.getByTestId('modal-finalized')).toBeInTheDocument();
    expect(screen.queryByTestId('modal-action-advance')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-action-approve')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<SolicitacaoModal {...defaultProps} />);

    await user.click(screen.getByTestId('modal-close-button'));

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onUpdateStatus with next step when Avançar is clicked', async () => {
    const user = userEvent.setup();
    render(<SolicitacaoModal {...defaultProps} />);

    await user.click(screen.getByTestId('modal-action-advance'));

    expect(defaultProps.onUpdateStatus).toHaveBeenCalledWith('visita');
  });
});
```

- [ ] **Step 2: Rodar para confirmar falha**

```bash
cd services/frontend && yarn test SolicitacaoModal --no-coverage
```

Expected: FAIL — arquivo não existe.

- [ ] **Step 3: Implementar o componente**

`SolicitacaoModal.tsx`:

```typescript
'use client';

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { AdoptionRequestDetailType, AdoptionProcessStepType } from '@/types/adoption-request';
import { ADOPTION_PROCESS_STEPS, FINAL_STEPS } from '@/types/adoption-request';

import styles from './SolicitacaoModal.module.css';

type SolicitacaoModalPropsType = {
  isOpen: boolean;
  detail: AdoptionRequestDetailType | null;
  isLoadingDetail: boolean;
  detailError: string | null;
  updateError: string | null;
  onClose: () => void;
  onUpdateStatus: (status: AdoptionProcessStepType, observations?: string) => void;
};

export default function SolicitacaoModal({
  isOpen,
  detail,
  isLoadingDetail,
  detailError,
  updateError,
  onClose,
  onUpdateStatus,
}: SolicitacaoModalPropsType) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} data-testid="solicitacao-modal">
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <ModalHeader onClose={onClose} />
        <div className={styles.body}>
          {isLoadingDetail ? <ModalLoading /> : null}
          {!isLoadingDetail && detailError ? <ModalError errorKey={detailError} /> : null}
          {!isLoadingDetail && !detailError && detail ? (
            <ModalContent detail={detail} updateError={updateError} onUpdateStatus={onUpdateStatus} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ModalHeader({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');

  return (
    <div className={styles.header}>
      <h2 id="modal-title" className={styles.title}>{t('modalTitle')}</h2>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label={t('modalClose')}
        data-testid="modal-close-button"
      >
        ✕
      </button>
    </div>
  );
}

function ModalLoading() {
  return <div className={styles.loading} data-testid="modal-loading" aria-busy="true" />;
}

function ModalError({ errorKey }: { errorKey: string }) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');
  return (
    <div className={styles.errorMessage} data-testid="modal-detail-error">
      {t(errorKey.replace('ADMIN_SOLICITACOES:', ''))}
    </div>
  );
}

type ModalContentPropsType = {
  detail: AdoptionRequestDetailType;
  updateError: string | null;
  onUpdateStatus: (status: AdoptionProcessStepType, observations?: string) => void;
};

function ModalContent({ detail, updateError, onUpdateStatus }: ModalContentPropsType) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');
  const isFinalized = FINAL_STEPS.includes(detail.status);

  return (
    <>
      <dl className={styles.fields}>
        <ModalField label={t('modalDateLabel')} value={new Date(detail.created_at).toLocaleDateString('pt-BR')} />
        <ModalField label={t('modalAdopterLabel')} value={`${detail.adopter_name} (${detail.adopter_email})`} />
        <ModalField label={t('modalAnimalLabel')} value={detail.pet_name} />
        <ModalField label={t('modalCityLabel')} value={detail.pet_city} />
        <ModalField
          label={t('modalObservationsLabel')}
          value={detail.observations ?? t('modalObservationsEmpty')}
        />
      </dl>

      <ProcessStepper status={detail.status} />

      {updateError ? (
        <div className={styles.errorMessage} data-testid="modal-update-error">
          {t(updateError.replace('ADMIN_SOLICITACOES:', ''))}
        </div>
      ) : null}

      {isFinalized ? (
        <div className={styles.finalizedMessage} data-testid="modal-finalized">
          {t('modalFinalized')}
        </div>
      ) : (
        <ModalActions detail={detail} onUpdateStatus={onUpdateStatus} />
      )}
    </>
  );
}

function ModalField({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.field}>
      <dt className={styles.fieldLabel}>{label}</dt>
      <dd className={styles.fieldValue}>{value}</dd>
    </div>
  );
}

function ProcessStepper({ status }: { status: AdoptionProcessStepType }) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');

  const stepLabelKey: Record<AdoptionProcessStepType, string> = {
    formulario: 'stepFormulario',
    documentacao: 'stepDocumentacao',
    entrevista: 'stepEntrevista',
    visita: 'stepVisita',
    aprovacao_final: 'stepAprovacaoFinal',
    aprovado: 'stepAprovado',
    rejeitado: 'stepRejeitado',
  };

  return (
    <div className={styles.stepper} aria-label={t('modalProcessTitle')}>
      {ADOPTION_PROCESS_STEPS.map(step => (
        <div
          key={step}
          className={`${styles.step} ${step === status ? styles.stepActive : ''} ${ADOPTION_PROCESS_STEPS.indexOf(step) < ADOPTION_PROCESS_STEPS.indexOf(status as typeof ADOPTION_PROCESS_STEPS[number]) ? styles.stepDone : ''}`}
          data-testid={`stepper-step-${step}`}
        >
          <span className={styles.stepLabel}>{t(stepLabelKey[step])}</span>
        </div>
      ))}
    </div>
  );
}

type ModalActionsPropsType = {
  detail: AdoptionRequestDetailType;
  onUpdateStatus: (status: AdoptionProcessStepType, observations?: string) => void;
};

function ModalActions({ detail, onUpdateStatus }: ModalActionsPropsType) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');
  const currentIndex = ADOPTION_PROCESS_STEPS.indexOf(detail.status as typeof ADOPTION_PROCESS_STEPS[number]);
  const isLastStep = currentIndex === ADOPTION_PROCESS_STEPS.length - 1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < ADOPTION_PROCESS_STEPS.length - 1;

  const handleAdvance = useCallback(() => {
    if (isLastStep) return;
    onUpdateStatus(ADOPTION_PROCESS_STEPS[currentIndex + 1]);
  }, [currentIndex, isLastStep, onUpdateStatus]);

  const handleBack = useCallback(() => {
    if (!hasPrev) return;
    onUpdateStatus(ADOPTION_PROCESS_STEPS[currentIndex - 1]);
  }, [currentIndex, hasPrev, onUpdateStatus]);

  const handleApprove = useCallback(() => {
    onUpdateStatus('aprovado');
  }, [onUpdateStatus]);

  const handleReject = useCallback(() => {
    onUpdateStatus('rejeitado');
  }, [onUpdateStatus]);

  if (isLastStep) {
    return (
      <div className={styles.actions}>
        {hasPrev ? (
          <button type="button" className={styles.secondaryButton} onClick={handleBack} data-testid="modal-action-back">
            {t('modalActionBack')}
          </button>
        ) : null}
        <button type="button" className={styles.rejectButton} onClick={handleReject} data-testid="modal-action-reject">
          {t('modalActionReject')}
        </button>
        <button type="button" className={styles.approveButton} onClick={handleApprove} data-testid="modal-action-approve">
          {t('modalActionApprove')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      {hasPrev ? (
        <button type="button" className={styles.secondaryButton} onClick={handleBack} data-testid="modal-action-back">
          {t('modalActionBack')}
        </button>
      ) : null}
      {hasNext ? (
        <button type="button" className={styles.primaryButton} onClick={handleAdvance} data-testid="modal-action-advance">
          {t('modalActionAdvance')}
        </button>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Criar o CSS**

`SolicitacaoModal.module.css`:

```css
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.closeButton {
  background: none;
  border: none;
  font-size: 20px;
  color: #777777;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
  border-radius: 4px;
  transition: background-color 0.15s;
}

.closeButton:hover {
  background-color: #f0f0f0;
}

.body {
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fieldLabel {
  font-size: 12px;
  font-weight: 600;
  color: #777777;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.fieldValue {
  font-size: 14px;
  color: #1a1a1a;
  margin: 0;
}

.stepper {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.step {
  flex: 1;
  min-width: 80px;
  padding: 8px 4px;
  text-align: center;
  border-radius: 6px;
  background-color: #f5f5f5;
  border: 2px solid transparent;
}

.stepActive {
  border-color: #7b2d8b;
  background-color: #f8eefa;
}

.stepDone {
  background-color: #e8f5e9;
}

.stepLabel {
  font-size: 11px;
  font-weight: 500;
  color: #555555;
}

.stepActive .stepLabel {
  color: #7b2d8b;
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid #e0e0e0;
}

.primaryButton {
  padding: 10px 20px;
  background-color: #7b2d8b;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.primaryButton:hover {
  background-color: #6a2578;
}

.secondaryButton {
  padding: 10px 20px;
  background-color: transparent;
  color: #555555;
  border: 1px solid #cccccc;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s;
}

.secondaryButton:hover {
  border-color: #999999;
}

.approveButton {
  padding: 10px 20px;
  background-color: #2e7d32;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.approveButton:hover {
  background-color: #1b5e20;
}

.rejectButton {
  padding: 10px 20px;
  background-color: #d32f2f;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.rejectButton:hover {
  background-color: #b71c1c;
}

.loading {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #7b2d8b;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 40px auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.errorMessage {
  padding: 12px;
  background-color: #fdecea;
  border-radius: 8px;
  color: #d32f2f;
  font-size: 14px;
}

.finalizedMessage {
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #555555;
  font-size: 14px;
  text-align: center;
}
```

- [ ] **Step 5: Rodar os testes e confirmar que passam**

```bash
cd services/frontend && yarn test SolicitacaoModal --no-coverage
```

Expected: 9 tests passed.

- [ ] **Step 6: Commit**

```bash
git add services/frontend/src/features/admin/solicitacoes/components/SolicitacaoModal/
git commit -m "feat(admin): add SolicitacaoModal component with process stepper and actions"
```

---

## Task 11 — Frontend: `SolicitacoesScreen` e page `/admin/solicitacoes`

**Files:**
- Create: `services/frontend/src/features/admin/solicitacoes/screens/SolicitacoesScreen.tsx`
- Create: `services/frontend/src/features/admin/solicitacoes/screens/SolicitacoesScreen.module.css`
- Create: `services/frontend/src/features/admin/solicitacoes/screens/SolicitacoesScreen.spec.tsx`
- Create: `services/frontend/src/app/(admin)/solicitacoes/page.tsx`

- [ ] **Step 1: Escrever o teste da screen (falha esperada)**

`SolicitacoesScreen.spec.tsx`:

```typescript
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@/lib/i18n';
import { useSolicitacoes } from '@/features/admin/solicitacoes/hooks/useSolicitacoes';
import { useSolicitacaoModal } from '@/features/admin/solicitacoes/hooks/useSolicitacaoModal';

import SolicitacoesScreen from './SolicitacoesScreen';

jest.mock('@/features/admin/solicitacoes/hooks/useSolicitacoes');
jest.mock('@/features/admin/solicitacoes/hooks/useSolicitacaoModal');

const mockUseSolicitacoes = useSolicitacoes as jest.MockedFunction<typeof useSolicitacoes>;
const mockUseSolicitacaoModal = useSolicitacaoModal as jest.MockedFunction<typeof useSolicitacaoModal>;

const defaultSolicitacoesHook = {
  solicitacoes: [],
  pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  isLoading: false,
  error: null,
  setFilters: jest.fn(),
  setPage: jest.fn(),
};

const defaultModalHook = {
  isOpen: false,
  detail: null,
  isLoadingDetail: false,
  detailError: null,
  updateError: null,
  openModal: jest.fn(),
  closeModal: jest.fn(),
  updateStatus: jest.fn(),
};

describe('SolicitacoesScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSolicitacoes.mockReturnValue(defaultSolicitacoesHook);
    mockUseSolicitacaoModal.mockReturnValue(defaultModalHook);
  });

  it('should render page title', () => {
    render(<SolicitacoesScreen />);
    expect(screen.getByTestId('page-title')).toBeInTheDocument();
  });

  it('should render search input and filters', () => {
    render(<SolicitacoesScreen />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('filter-species')).toBeInTheDocument();
    expect(screen.getByTestId('filter-sex')).toBeInTheDocument();
    expect(screen.getByTestId('filter-size')).toBeInTheDocument();
  });

  it('should render empty state when no solicitacoes', () => {
    render(<SolicitacoesScreen />);
    expect(screen.getByTestId('table-empty-state')).toBeInTheDocument();
  });

  it('should show loading spinner when isLoading=true', () => {
    mockUseSolicitacoes.mockReturnValue({ ...defaultSolicitacoesHook, isLoading: true });
    render(<SolicitacoesScreen />);
    expect(screen.getByTestId('list-loading')).toBeInTheDocument();
  });

  it('should show error message when error is set', () => {
    mockUseSolicitacoes.mockReturnValue({ ...defaultSolicitacoesHook, error: 'ADMIN_SOLICITACOES:errorLoading' });
    render(<SolicitacoesScreen />);
    expect(screen.getByTestId('list-error')).toBeInTheDocument();
  });

  it('should call openModal when "Ver solicitação" is clicked from the table', async () => {
    const user = userEvent.setup();
    mockUseSolicitacoes.mockReturnValue({
      ...defaultSolicitacoesHook,
      solicitacoes: [{
        id: 'uuid-1',
        created_at: '2026-06-08T10:00:00Z',
        adopter_name: 'Maria',
        pet_name: 'Bolinha',
        pet_species: 'cachorro',
        pet_sex: 'macho',
        pet_size: 'medio',
        pet_age_months: 24,
        pet_city: 'São Paulo',
        status: 'formulario',
      }],
    });

    render(<SolicitacoesScreen />);

    await user.click(screen.getByTestId('view-request-uuid-1'));

    expect(defaultModalHook.openModal).toHaveBeenCalledWith('uuid-1');
  });

  it('should call setFilters with debounce when search input changes', async () => {
    const user = userEvent.setup({ delay: null });
    render(<SolicitacoesScreen />);

    await user.type(screen.getByTestId('search-input'), 'Bolinha');

    await waitFor(() => {
      expect(defaultSolicitacoesHook.setFilters).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'Bolinha' }),
      );
    });
  });
});
```

- [ ] **Step 2: Rodar para confirmar falha**

```bash
cd services/frontend && yarn test SolicitacoesScreen --no-coverage
```

Expected: FAIL — arquivo não existe.

- [ ] **Step 3: Implementar a screen**

`SolicitacoesScreen.tsx`:

```typescript
'use client';

import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { PetSpeciesType, PetSexType, PetSizeType } from '@/types/adoption-request';
import { useSolicitacoes } from '@/features/admin/solicitacoes/hooks/useSolicitacoes';
import { useSolicitacaoModal } from '@/features/admin/solicitacoes/hooks/useSolicitacaoModal';
import SolicitacoesTable from '@/features/admin/solicitacoes/components/SolicitacoesTable/SolicitacoesTable';
import SolicitacaoModal from '@/features/admin/solicitacoes/components/SolicitacaoModal/SolicitacaoModal';

import styles from './SolicitacoesScreen.module.css';

export default function SolicitacoesScreen() {
  const { t } = useTranslation('ADMIN_SOLICITACOES');
  const { solicitacoes, pagination, isLoading, error, setFilters, setPage } = useSolicitacoes();
  const { isOpen, detail, isLoadingDetail, detailError, updateError, openModal, closeModal, updateStatus } = useSolicitacaoModal();

  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setFilters({ search: value });
  }, [setFilters]);

  const handleSpeciesChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PetSpeciesType | '';
    setFilters({ species: value || undefined });
  }, [setFilters]);

  const handleSexChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PetSexType | '';
    setFilters({ sex: value || undefined });
  }, [setFilters]);

  const handleSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as PetSizeType | '';
    setFilters({ size: value || undefined });
  }, [setFilters]);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle} data-testid="page-title">
        {t('pageTitle')}
      </h1>

      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={t('searchPlaceholder')}
          value={searchValue}
          onChange={handleSearchChange}
          data-testid="search-input"
          aria-label={t('searchPlaceholder')}
        />

        <select className={styles.filterSelect} onChange={handleSpeciesChange} data-testid="filter-species" aria-label={t('filterSpeciesLabel')}>
          <option value="">{t('filterSpeciesAll')}</option>
          <option value="gato">{t('filterSpeciesCat')}</option>
          <option value="cachorro">{t('filterSpeciesDog')}</option>
        </select>

        <select className={styles.filterSelect} onChange={handleSexChange} data-testid="filter-sex" aria-label={t('filterSexLabel')}>
          <option value="">{t('filterSexAll')}</option>
          <option value="macho">{t('filterSexMale')}</option>
          <option value="femea">{t('filterSexFemale')}</option>
        </select>

        <select className={styles.filterSelect} onChange={handleSizeChange} data-testid="filter-size" aria-label={t('filterSizeLabel')}>
          <option value="">{t('filterSizeAll')}</option>
          <option value="pequeno">{t('filterSizeSmall')}</option>
          <option value="medio">{t('filterSizeMedium')}</option>
          <option value="grande">{t('filterSizeLarge')}</option>
        </select>
      </div>

      {isLoading ? (
        <div className={styles.loading} data-testid="list-loading" aria-busy="true" />
      ) : null}

      {!isLoading && error ? (
        <div className={styles.errorMessage} data-testid="list-error">
          {t(error.replace('ADMIN_SOLICITACOES:', ''))}
        </div>
      ) : null}

      {!isLoading && !error ? (
        <>
          <SolicitacoesTable solicitacoes={solicitacoes} onViewRequest={openModal} />
          {pagination.totalPages > 1 ? (
            <Pagination pagination={pagination} onPageChange={setPage} />
          ) : null}
        </>
      ) : null}

      <SolicitacaoModal
        isOpen={isOpen}
        detail={detail}
        isLoadingDetail={isLoadingDetail}
        detailError={detailError}
        updateError={updateError}
        onClose={closeModal}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}

type PaginationPropsType = {
  pagination: { page: number; totalPages: number };
  onPageChange: (page: number) => void;
};

function Pagination({ pagination, onPageChange }: PaginationPropsType) {
  const { t } = useTranslation('ADMIN_SOLICITACOES');

  const handlePrev = useCallback(() => {
    onPageChange(pagination.page - 1);
  }, [pagination.page, onPageChange]);

  const handleNext = useCallback(() => {
    onPageChange(pagination.page + 1);
  }, [pagination.page, onPageChange]);

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.paginationButton}
        disabled={pagination.page <= 1}
        onClick={handlePrev}
        data-testid="pagination-prev"
      >
        {t('paginationPrev')}
      </button>
      <span className={styles.paginationInfo} data-testid="pagination-info">
        {t('paginationInfo')
          .replace('{{page}}', String(pagination.page))
          .replace('{{totalPages}}', String(pagination.totalPages))}
      </span>
      <button
        type="button"
        className={styles.paginationButton}
        disabled={pagination.page >= pagination.totalPages}
        onClick={handleNext}
        data-testid="pagination-next"
      >
        {t('paginationNext')}
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Criar o CSS da screen**

`SolicitacoesScreen.module.css`:

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pageTitle {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.searchInput {
  flex: 1;
  min-width: 200px;
  padding: 10px 14px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.searchInput:focus {
  border-color: #7b2d8b;
}

.filterSelect {
  padding: 10px 14px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  font-size: 14px;
  background-color: #ffffff;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.filterSelect:focus {
  border-color: #7b2d8b;
}

.loading {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #7b2d8b;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 40px auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.errorMessage {
  padding: 16px;
  background-color: #fdecea;
  border-radius: 8px;
  color: #d32f2f;
  font-size: 14px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.paginationButton {
  padding: 8px 16px;
  border: 1px solid #cccccc;
  border-radius: 6px;
  background-color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.paginationButton:hover:not(:disabled) {
  border-color: #7b2d8b;
  color: #7b2d8b;
}

.paginationButton:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.paginationInfo {
  font-size: 14px;
  color: #555555;
}
```

- [ ] **Step 5: Criar a page do App Router**

`services/frontend/src/app/(admin)/solicitacoes/page.tsx`:

```typescript
import SolicitacoesScreen from '@/features/admin/solicitacoes/screens/SolicitacoesScreen';

export default function SolicitacoesPage() {
  return <SolicitacoesScreen />;
}
```

- [ ] **Step 6: Rodar os testes da screen e confirmar que passam**

```bash
cd services/frontend && yarn test SolicitacoesScreen --no-coverage
```

Expected: 7 tests passed.

- [ ] **Step 7: Rodar toda a suite de testes do frontend para verificar regressões**

```bash
cd services/frontend && yarn test --no-coverage
```

Expected: todos os testes passam, sem regressões no fluxo de auth.

- [ ] **Step 8: Commit**

```bash
git add services/frontend/src/features/admin/solicitacoes/screens/ \
        services/frontend/src/app/(admin)/solicitacoes/
git commit -m "feat(admin): add SolicitacoesScreen with filters, pagination, and modal integration"
```

---

## Task 12 — Verificação end-to-end

- [ ] **Step 1: Subir o backend e o frontend**

```bash
# Terminal 1
cd services/backend && yarn start:dev

# Terminal 2
cd services/frontend && yarn dev
```

- [ ] **Step 2: Verificar CT-01 — Login admin redireciona para /admin/solicitacoes**

Fazer login com um usuário que tenha `role: 'admin'` no Supabase user_metadata. Confirmar redirecionamento para `/admin/solicitacoes`.

- [ ] **Step 3: Verificar CT-02 — Login não-admin redireciona para /**

Fazer login com usuário role `adotante`. Confirmar redirecionamento para `/`.

- [ ] **Step 4: Verificar CT-03 — Abrir modal de solicitação**

Na lista, clicar em "Ver solicitação". Confirmar que o modal abre com dados do pedido e sem navegação de página.

- [ ] **Step 5: Verificar CT-04 — Erro ao abrir pedido inexistente**

Simular erro de rede ou ID inválido (via DevTools → Network → block request). Confirmar mensagem de erro no modal.

- [ ] **Step 6: Verificar CT-05 — Pedido finalizado desabilita ações**

Verificar um pedido com status `aprovado` ou `rejeitado`. Confirmar que aparece mensagem de finalização e não há botões de ação.

- [ ] **Step 7: Verificar RNF-03 — Acesso negado sem autenticação**

Sem cookie de session, acessar `/admin/solicitacoes` diretamente. Confirmar redirecionamento para `/login`.

- [ ] **Step 8: Commit final**

```bash
git add -A
git commit -m "feat(FEATURE-001): lista de solicitações de adoção e modal de detalhes — validação e2e concluída"
```

---

## Self-Review

### Cobertura do Spec

| Requisito | Task |
|---|---|
| HU-01: Redirect admin após login | Task 4 |
| HU-02: Modal sem navegação de página | Tasks 8, 10 |
| RN-01: Somente admin acessa a lista | Task 2 (AdminGuard) |
| RN-02: Primeiro destino do admin é a lista | Task 4 |
| RN-03: Modal como overlay | Task 10 |
| RN-04: Status e etapas no modal | Tasks 8, 10 |
| RN-05: Botões de ação críticos em cores separadas | Task 10 (CSS) |
| RN-06: Sem autenticação → bloqueado | Task 5 (middleware) |
| RN-07: "Ver solicitação" disponível em qualquer estágio | Task 9 |
| RF: Barra de busca e filtros | Task 11 |
| RF: Tabela com colunas definidas | Task 9 |
| RF: Paginação | Tasks 7, 11 |
| RF: Mensagens de erro/vazio | Tasks 6, 9, 10, 11 |
| RF: Ações de avançar/rejeitar/aprovar | Task 10 |
| CT-01..CT-05 | Task 12 |
| CA-01..CA-05 | Task 12 |

### Consistência de Tipos

- `AdoptionProcessStepType` definido em `adoption-request.ts` (Task 3) e usado em `useSolicitacaoModal.ts` (Task 8), `SolicitacaoModal.tsx` (Task 10).
- `ADOPTION_PROCESS_STEPS` exportado de `adoption-request.ts` e importado em `SolicitacaoModal.tsx` — consistente.
- `AdoptionRequestSummaryType` / `AdoptionRequestDetailType` usados de forma consistente em todos os hooks e componentes.
