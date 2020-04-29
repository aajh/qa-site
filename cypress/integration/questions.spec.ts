describe('Questions', () => {
    beforeEach(() => {
        cy.task('resetAndSeedDatabase');
        cy.visit('/');
    });

    it('shows the seeded questions', () => {
        const title = 'favicon.ico 500 error when fetching robots.txt';
        const poster = 'Kevin';
        const body = 'I have an error 500 on my example.com/robots.txt page.';
        const comment = 'Just do something else.';

        cy.get('.list-group > .list-group-item').as('item');
        cy.get('@item').should('contain', title);
        cy.get('@item').should('contain', poster);

        cy.get('@item').contains(title).click();

        cy.get('h2').should('contain', title);
        cy.get('p').should('contain', body);

        cy.get('.list-group > .list-group-item').should('contain', comment);
    });

    describe('when logged in', () => {
        beforeEach(() => {
            cy.login({ username: 'Kevin', password: 'password' });
        });

        it('asks a question', () => {
            const title = 'Test Question';
            const body = 'Test question body.';

            cy.get('nav').contains('Ask').click();

            cy.get('input[name=title]').type(title);
            cy.get('textarea[name=body]').type(body);
            cy.get('form button[type=submit]').click();

            cy.get('h2').should('contain', title);
            cy.get('p').should('contain', body);
        });

        it('answers a question', () => {
            const title = 'Answer Test Question';
            const answer = 'Test answer.';

            cy.createQuestion({ title, body: 'Test body.' });
            cy.contains(title).click();

            cy.get('textarea[name=body]').type(answer);
            cy.get('form button[type=submit]').click();

            cy.get('p').should('contain', answer);
        });
    });
});
