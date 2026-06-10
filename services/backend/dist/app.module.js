"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const configuration_1 = require("./config/configuration");
const auth_module_1 = require("./modules/auth/auth.module");
const pets_module_1 = require("./modules/pets/pets.module");
const solicitacoes_module_1 = require("./modules/solicitacoes/solicitacoes.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: [(0, path_1.resolve)(__dirname, '../.env'), '.env'],
                load: [configuration_1.configuration],
            }),
            auth_module_1.AuthModule,
            pets_module_1.PetsModule,
            solicitacoes_module_1.SolicitacoesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map