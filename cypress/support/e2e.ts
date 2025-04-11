/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import './commands'

// Prevent TypeScript errors when accessing the "cy" object
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      // Add custom commands here
      login(email: string, password: string): Chainable<void>
    }
  }
}
