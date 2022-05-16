export declare class OnlineGateway {
    private onlineUsers;
    constructor();
    handleOnlineUsers(client: any, payload: any): any;
    handleDisconnect(client: any, ...args: any[]): void;
    handleConnection(client: any, ...args: any[]): void;
}
