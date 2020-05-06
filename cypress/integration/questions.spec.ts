describe('Questions', () => {
    beforeEach(() => {
        cy.task('resetAndSeedDatabase');
        cy.clearLocalStorage();
        cy.visit('/');
    });

    it('shows the seeded questions', () => {
        const title = 'favicon.ico 500 error when fetching robots.txt';
        const poster = 'Kevin';
        const body = 'I have an error 500 on my example.com/robots.txt page.';
        const comment = 'Just do something else.';

        cy.get('.list-group').contains(title).parents('.list-group-item').as('item');
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

    describe('voting buttons', () => {
        const title = 'favicon.ico 500 error when fetching robots.txt';

        it('shows login modal when logged out', () => {
            cy.contains(title).click();
            cy.get('.list-group-item .vote-up').first().click();
            cy.get('.modal-header').should('contain', 'Login');
        });

        it('should vote and remove vote when logged in', () => {
            const comment = 'Just do something else.';

            cy.login({ username: 'Kevin', password: 'password' });
            cy.contains(title).click();
            cy.contains(comment).parents('.list-group-item').as('comment');

            cy.get('@comment').find('span').should('contain', 0);
            cy.get('@comment').find('.vote-up').click();
            cy.get('@comment').find('span').should('contain', 1);
            cy.reload();
            cy.get('@comment').find('span').should('contain', 1);

            cy.get('@comment').find('.vote-down').click();
            cy.get('@comment').find('span').should('contain', -1);

            cy.get('@comment').find('.vote-down').click();
            cy.get('@comment').find('span').should('contain', 0);
        });
    });
});
