/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login form', () => {
    cy.findByLabelText(/email/i).should('exist')
    cy.findByLabelText(/password/i).should('exist')
    cy.findByRole('button', { name: /sign in/i }).should('exist')
  })

  it('should show error with invalid credentials', () => {
    cy.findByLabelText(/email/i).type('invalid@example.com')
    cy.findByLabelText(/password/i).type('wrongpassword')
    cy.findByRole('button', { name: /sign in/i }).click()
    cy.findByText(/invalid credentials/i).should('exist')
  })

  it('should login with valid credentials', () => {
    cy.findByLabelText(/email/i).type('test@example.com')
    cy.findByLabelText(/password/i).type('password')
    cy.findByRole('button', { name: /sign in/i }).click()
    cy.url().should('include', '/dashboard')
  })
})
