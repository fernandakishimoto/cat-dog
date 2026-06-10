import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';

import { configuration } from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { PetsModule } from './modules/pets/pets.module';
import { SolicitacoesModule } from './modules/solicitacoes/solicitacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(__dirname, '../.env'), '.env'],
      load: [configuration],
    }),
    AuthModule,
    PetsModule,
    SolicitacoesModule,
  ],
})
export class AppModule {}
