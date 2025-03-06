import { expect, test } from 'bun:test';
import { fetch } from 'bun';
import { config } from '../config';

test('POST JSON data to URL and check response', async () => {
                const mount: number = 10
                const lang: string = 'python'

                const response = await fetch(`${config.API_HOST_URL}/code/fetch`, {
                                method: 'POST',
                                headers: {
                                                'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                                key: 'hi key',
                                                lang: lang,
                                                mount: mount
                                }),
                });
                const data = await response.json();
                console.log(data);

});