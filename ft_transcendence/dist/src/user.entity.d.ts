import { BaseEntity } from "typeorm";
export declare class UserEntity extends BaseEntity {
    id: number;
    email: string;
    login: string;
    image_url: string;
    twof: boolean;
    twof_secret: string;
    twof_qrcode: string;
    is_login: boolean;
}
