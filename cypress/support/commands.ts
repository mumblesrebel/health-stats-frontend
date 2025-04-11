/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

export {};

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): void
    }
  }
}

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.findByLabelText(/email/i).type(email)
  cy.findByLabelText(/password/i).type(password)
  cy.findByRole('button', { name: /sign in/i }).click()
})
