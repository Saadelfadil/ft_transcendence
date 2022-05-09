"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor() {
        super({
            clientID: "698937529046-9vnt3ucdbt7lor1b1475hnihio9sb2c4.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/api/auth/google/callback",
            scope: ['email', 'profile']
        });
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        };
        done(null, user);
    }
    ;
}
exports.GoogleStrategy = GoogleStrategy;
//# sourceMappingURL=google.strategy.js.map