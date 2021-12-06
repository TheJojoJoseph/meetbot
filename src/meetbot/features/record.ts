import { Page } from 'puppeteer-extra-plugin/dist/puppeteer';
import { Bot } from '..';
import { clickText } from '../google-meet-helpers';

export const attach = (bot: Bot) => {
	console.log('Running record feature..');
	bot.on('joined', () => {
		console.log('queuing: starting the recording...');
		bot.addJob(startRecording);
	});
};

const startRecording = async (page: Page) => {
	if (
		'Rec' ===
		(await (await page.$('.F9AaL'))?.evaluate((element) => element.textContent))
	) {
		console.log('Recording is already turned on. Not trying to record.');
		return;
	}

	console.log('starting the recording...');
	await clickText(page, 'themes');
	await page.waitForTimeout(2000);

	await clickText(page, 'Recording');
	await page.waitForTimeout(2000);

	const btn = await page.waitForXPath("//*[@aria-label='Start recording']");
	await btn?.click();
	await page.waitForTimeout(2000);

	// HACK: this is so terrible...
	const btns = await page.$$('.RveJvd.snByac');
	for (const b of btns) {
		if (await b.evaluate((n) => n.innerHTML === 'Start')) {
			try {
				await b.click();
				break;
			} catch {
				// ...
			}
		}
	}
	await page.waitForTimeout(2000);
	// await page.screenshot({ path: 'after-recording-start.png' });
};
