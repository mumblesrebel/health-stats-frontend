/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Dashboard', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password')
    cy.visit('/dashboard')
  })

  it('should display health metrics summary', () => {
    cy.findByText(/health overview/i).should('exist')
    cy.findByText(/recent weight/i).should('exist')
    cy.findByText(/daily steps/i).should('exist')
    cy.findByText(/heart rate/i).should('exist')
  })

  it('should show quick add form', () => {
    cy.findByRole('button', { name: /quick add/i }).click()
    cy.findByRole('dialog').within(() => {
      cy.findByLabelText(/metric type/i).should('exist')
      cy.findByLabelText(/value/i).should('exist')
      cy.findByRole('button', { name: /save/i }).should('exist')
    })
  })

  it('should navigate to detailed views', () => {
    cy.findByRole('link', { name: /view weight history/i }).click()
    cy.url().should('include', '/stats?type=weight')
    
    cy.visit('/dashboard')
    cy.findByRole('link', { name: /view steps history/i }).click()
    cy.url().should('include', '/stats?type=steps')
  })

  it('should handle loading states', () => {
    cy.intercept('GET', '/api/health-records/summary', {
      delay: 1000,
      fixture: 'summary.json'
    })
    cy.visit('/dashboard')
    cy.findByRole('progressbar').should('exist')
    cy.findByText(/loading/i).should('exist')
    cy.findByText(/health overview/i).should('exist')
  })

  it('should handle error states', () => {
    cy.intercept('GET', '/api/health-records/summary', {
      statusCode: 500,
      body: { message: 'Server error' }
    })
    cy.visit('/dashboard')
    cy.findByText(/error loading data/i).should('exist')
    cy.findByRole('button', { name: /retry/i }).click()
    cy.findByText(/health overview/i).should('exist')
  })
})
