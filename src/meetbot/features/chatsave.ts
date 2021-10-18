import * as fs from 'fs';
import { Bot } from '..';
import { Credentials, GoogleDoc } from '../google-doc';
import { postToChatJob } from '../pptr-helpers';

export const attach = (bot: Bot): void => {
	let credentials: Credentials | null = null;
	try {
		const credentialsFile = fs.readFileSync('credentials.json').toString();
		credentials = JSON.parse(credentialsFile).installed;
	} catch (err) {
		console.log(
			'Cannot read credentials.json - required to use Google Docs writer',
			err,
		);
	}
	if (!credentials) {
		console.log('deactivating google docs feature due to missing credentials');
		return;
	}
	const doc = new GoogleDoc(credentials);
	let docId: string;
	console.log('Attached Chat Saver');

	bot.on('joined', async ({ meetURL }) => {
		const meetId = meetURL.split('/').pop();
		const docName = `Meeting ${meetId} (${new Date().toISOString()}) Chat`;
		docId = await doc.create(docName);
		doc.addTitle('Chat Transcript\n\n');
		bot.addJob(
			postToChatJob(
				`Chat history is available at: https://docs.google.com/document/d/${docId}`,
			),
		);
	});
	bot.on('chat', ({ timestamp, sender, text }) => {
		doc.addHeading(
			`${new Date(+String(timestamp)).toISOString()} - ${sender}:\n`,
		);
		doc.addText(`${text}\n\n`);
	});
};