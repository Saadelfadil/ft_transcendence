"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlockDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_block_dto_1 = require("./create-block.dto");
class UpdateBlockDto extends (0, mapped_types_1.PartialType)(create_block_dto_1.CreateBlockDto) {
}
exports.UpdateBlockDto = UpdateBlockDto;
//# sourceMappingURL=update-block.dto.js.map