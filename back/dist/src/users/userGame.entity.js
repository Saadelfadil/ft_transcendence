"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGameEntity = void 0;
const typeorm_1 = require("typeorm");
let UserGameEntity = class UserGameEntity extends typeorm_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.wins = 0;
        this.loses = 0;
        this.score = 0;
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], UserGameEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: false }),
    __metadata("design:type", Number)
], UserGameEntity.prototype, "wins", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: false }),
    __metadata("design:type", Number)
], UserGameEntity.prototype, "loses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', nullable: false }),
    __metadata("design:type", Number)
], UserGameEntity.prototype, "score", void 0);
UserGameEntity = __decorate([
    (0, typeorm_1.Entity)('userGame')
], UserGameEntity);
exports.UserGameEntity = UserGameEntity;
//# sourceMappingURL=userGame.entity.js.map