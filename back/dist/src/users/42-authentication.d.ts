declare class Authenticator {
    private readonly uid;
    private readonly secret;
    private readonly redirect_uri;
    constructor(uid: any, secret: any, redirect_uri: any);
    get_Access_token(code: any): Promise<any>;
    is_valid_token(access_token: any): Promise<boolean>;
    get_user_data(access_token: any): Promise<any>;
}
export default Authenticator;
