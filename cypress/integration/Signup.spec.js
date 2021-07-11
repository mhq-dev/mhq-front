// Signup.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('SignUp Tests', function () {
    it('Unuccessfull SignUp - repeat password not filled', function () {
        cy.visit('http://localhost:3000/signup')

        cy.get("Input#username-signup")
        .type('ramtin')

        cy.get("Input#email-signup")
        .type('ramtin@gmail.com')

        cy.get("Input#password-signup")
        .type('123456')

        cy.get('Button')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/signup')

        cy.get('.ant-form-item-explain')
        .should('have.text', 'Please repeat your password!')
    })

    it('Unuccessfull SignUp - password not filled', function () {
        cy.visit('http://localhost:3000/signup')

        cy.get("Input#username-signup")
        .type('ramtin')

        cy.get("Input#email-signup")
        .type('ramtin@gmail.com')

        cy.get("Input#repeat-password-signup")
        .type('123456')

        cy.get('Button')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/signup')

        cy.get('.ant-form-item-explain')
        .should('have.text', 'Please input your Password!')
    })

    it('Unuccessfull SignUp - email not filled', function () {
        cy.visit('http://localhost:3000/signup')

        cy.get("Input#username-signup")
        .type('ramtin')

        cy.get("Input#password-signup")
        .type('123456')

        cy.get("Input#repeat-password-signup")
        .type('123456')

        cy.get('Button')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/signup')

        cy.get('.ant-form-item-explain')
        .should('have.text', 'Please input your email address!')
    })

    it('Unuccessfull SignUp - username not filled', function () {
        cy.visit('http://localhost:3000/signup')

        cy.get("Input#email-signup")
        .type('ramtin@gmail.com')

        cy.get("Input#password-signup")
        .type('123456')

        cy.get("Input#repeat-password-signup")
        .type('123456')

        cy.get('Button')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/signup')

        cy.get('.ant-form-item-explain')
        .should('have.text', 'Please input your Username!')
    })

    it('Unuccessfull SignUp - password and repeat different', function () {
        cy.visit('http://localhost:3000/signup')

        cy.get("Input#username-signup")
        .type('ramtin')

        cy.get("Input#email-signup")
        .type('ramtin@gmail.com')

        cy.get("Input#password-signup")
        .type('123456789')

        cy.get("Input#repeat-password-signup")
        .type('123456')

        cy.get('Button')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/signup')

        cy.get('.ant-message-notice')
        .should('have.text', 'Please check the password')
    })

    it('Redirect to Login', function () {
        cy.visit('http://localhost:3000/signup')

        cy.get('a')
        .click()

        cy.url()
        .should('contain', 'http://localhost:3000/login')
    })
})