import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	console.log('In Google Auth google.ts');
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { code } = req.query;

	console.log({ code });

	// if (!code || typeof code !== 'string') {
	// 	return res
	// 		.status(400)
	// 		.json({ error: 'No authorization code provided' });
	// }

	const oauth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		process.env.GOOGLE_REDIRECT_URL
	);

	try {
		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);

		const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
		const { data } = await oauth2.userinfo.get();

		console.log({ data });

		if (!data.email) {
			return res
				.status(400)
				.json({ error: 'No email found in Google profile' });
		}

		// const user = {
		// 	id: data.id,
		// 	email: data.email,
		// 	name: data.name,
		// 	image: data.picture,
		// 	accessToken: tokens.access_token,
		// };

		// Here you might want to save the user to your database
		// or perform any other necessary operations

		// Redirect the user to a success page or your main application
		res.redirect(302, '/?status=success');
	} catch (error) {
		console.error('Error during Google authentication:', error);
		res.redirect(302, '/?status=error');
	}
}
