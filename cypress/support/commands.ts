export {}; // Fixes typescript error for declare global

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
        .then(() => cy.reload());
}
Cypress.Commands.add('login', login);

function register(info: { username: string, password: string }, shouldLogin = false): void {
    cy.request('POST', '/api/users', info)
        .then(() => {
            if (shouldLogin) {
                cy.reload();
            }
        });
}
Cypress.Commands.add('register', register);

function createQuestion(question: { title: string, body: string }): void {
    cy.request({
        url: '/api/questions',
        method: 'POST',
        body: question,
    });
    cy.get('nav').contains('Home').click();
}
Cypress.Commands.add('createQuestion', createQuestion);
