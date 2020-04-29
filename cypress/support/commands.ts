import * as api from '../../src/api/types';

declare global {
    namespace Cypress {
        interface Chainable {
            login: typeof login
            register: typeof register
            createQuestion: typeof createQuestion
        }
    }
}

function login(info: { username: string, password: string }): void {
    cy.request('POST', '/api/login', info)
        .then(({ body: { token } }: { body: api.Login}) => {
            localStorage.setItem('token', token);
            cy.reload();
        });
}
Cypress.Commands.add('login', login);

function register(info: { username: string, password: string }, shouldLogin = false): void {
    cy.request('POST', '/api/users', info)
        .then(({ body: { token } }: { body: api.Login}) => {
            if (shouldLogin) {
                localStorage.setItem('token', token);
                cy.reload();
            }
        });
}
Cypress.Commands.add('register', register);

function createQuestion(question: { title: string, body: string }): void {
    const token = localStorage.getItem('token');
    cy.request({
        url: '/api/questions',
        method: 'POST',
        body: question,
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    cy.get('nav').contains('Home').click();
}
Cypress.Commands.add('createQuestion', createQuestion);
