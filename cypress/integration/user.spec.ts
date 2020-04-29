describe('Users', () => {
    beforeEach(() => {
        cy.task('resetAndSeedDatabase');
        cy.visit('/');
    });

    it('logins and log successfully via the login modal and logouts', () => {
        const username = 'Login Test';
        const password = 'password';

        cy.register({ username, password });

        cy.get('nav').contains('Login').click();

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('button[form=login-form]').click();

        cy.get('nav').should('contain', username);
        cy.get('nav').contains('Logout').click();

        cy.get('nav').should('contain', 'Login');
    });

    it('registers and logins a new user', () => {
        const username = 'Registering Test';
        const password = 'password';

        cy.get('nav').contains('Register').click();

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('button[form=registration-form]').click();

        cy.get('nav').should('contain', username);
    });

    it('gives error when registering with existing username', () => {
        const username = 'Registering Twice Test';
        const password = 'password';

        cy.register({ username, password });

        cy.get('nav').contains('Register').click();

        cy.get('input[name=username]').type(username);
        cy.get('input[name=password]').type(password);
        cy.get('button[form=registration-form]').click();

        cy.get('form').should('contain', 'Username in use');
    });
});
