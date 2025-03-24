const baseUrl = 'http://localhost:4200';

describe('Home Page E2E test', () => {

    it('should navigate to our Home Page', () => {
        cy.visit(baseUrl);
    })
});