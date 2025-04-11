import { expect, test } from 'bun:test';
import { config } from '../config';
import { handle_sign_in } from '../module/auth/signin_login';

//signin test

test('handle_sign_in', () => {
                //input from terminal
                const test_user_github_id = prompt("input your github id") ?? "test_user_github_id"
                handle_sign_in(test_user_github_id).then((response) => {
                                expect(response.status).toBe(200);
                                expect(response.message).toBe("successfully user created!!!");
                })
                                .catch((error) => {
                                                console.error(error);
                                                expect(error).toBeUndefined();
                                });
});