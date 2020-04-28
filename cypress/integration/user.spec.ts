describe('Users', () => {
    before(() => {
        cy.exec('npm run db:test:reset && npm run db:test:seed');
    });
    beforeEach(() => {
        cy.visit('/');
    });

    it('logins and log successfully via the login modal and logouts', () => {
        const username = 'Kevin';
        const password = 'password';

        cy.get('nav').contains('Login').click();

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('button[form=login-form]').click();

        cy.get('nav').should('contain', username);
        cy.get('nav').contains('Logout').click();

        cy.get('nav').should('contain', 'Login');
    });
});
