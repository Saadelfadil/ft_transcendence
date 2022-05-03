import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
	constructor()
	{
		super({
			clientID: "698937529046-9vnt3ucdbt7lor1b1475hnihio9sb2c4.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "http://localhost:3000/api/auth/google/callback",
			scope: ['email', 'profile']
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) : Promise<any>
	{
		const {name, emails, photos} = profile;
		const user = {
			email: emails[0].value,
			firstName: name.givenName,
			lastName: name.familyName,
			picture: photos[0].value,
			accessToken
		}
		
		done(null, user);
	};
}