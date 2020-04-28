describe('Questions', () => {
    before(() => {
        cy.exec('npm run db:test:reset && npm run db:test:seed');
    });
    beforeEach(() => {
        cy.visit('/');
    });

    it('shows the seeded questions', () => {
        const title = 'favicon.ico 500 error when fetching robots.txt';
        const poster = 'Kevin';
        const bodyText = 'I have an error 500 on my example.com/robots.txt page.';
        const comment = 'Just do something else.';

        cy.get('.list-group > .list-group-item').as('item');
        cy.get('@item').should('contain', title);
        cy.get('@item').should('contain', poster);

        cy.get('@item').contains(title).click();

        cy.get('h2').should('contain', title);
        cy.get('p').should('contain', bodyText);

        cy.get('.list-group > .list-group-item').should('contain', comment);
    });
});
