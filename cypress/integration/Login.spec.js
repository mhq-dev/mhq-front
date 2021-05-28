// login_spec..js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Login Tests', function () {
    it('Successfull login', function () {
        cy.visit('http://localhost:3000/login')

        cy.get("Input#username")
        .type('ramtin')

        cy.get("Input#password")
        .type('XXX12345')

        cy.get('Button')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/dashboard')
    })

    it('Unsuccessfull login', function () {
        cy.visit('http://localhost:3000/login')

        cy.get("Input#username")
        .type('ramtin12')

        cy.get("Input#password")
        .type('XXX12345')

        cy.get('Button')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/login')

        cy.get('.ant-message-notice')
        .should('have.text', 'This account is not activated')
    })

    it('Empty password input filed', function () {
        cy.visit('http://localhost:3000/login')

        cy.get("Input#username")
        .type('ramtin12')

        cy.get('Button')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/login')

        cy.get('.ant-form-item-explain')
        .should('have.text', 'Please input your Password!')
    })

    it('Empty username input filed', function () {
        cy.visit('http://localhost:3000/login')

        cy.get("Input#password")
        .type('ramtin12')

        cy.get('Button')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/login')

        cy.get('.ant-form-item-explain')
        .should('have.text', 'Please input your Username!')
    })

    it('Redirect to SignUp', function () {
        cy.visit('http://localhost:3000/login')

        cy.get('a.login-form-register')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/signup')
    })
})