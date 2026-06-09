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
