/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('Health Records', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password')
    cy.visit('/stats')
  })

  it('should display health records table', () => {
    cy.findByRole('table').should('exist')
    cy.findByText(/weight/i).should('exist')
    cy.findByText(/steps/i).should('exist')
  })

  it('should filter records by type', () => {
    cy.findByLabelText(/metric type/i).click()
    cy.findByText(/weight/i).click()
    cy.findByRole('table').within(() => {
      cy.findByText(/steps/i).should('not.exist')
      cy.findByText(/70\.5 kg/i).should('exist')
    })
  })

  it('should add new health record', () => {
    cy.findByRole('button', { name: /add record/i }).click()
    cy.findByLabelText(/type/i).click()
    cy.findByText(/weight/i).click()
    cy.findByLabelText(/value/i).type('72.5')
    cy.findByRole('button', { name: /save/i }).click()
    cy.findByText(/72\.5 kg/i).should('exist')
  })

  it('should delete health record', () => {
    cy.findByRole('table').within(() => {
      cy.findByText(/70\.5 kg/i)
        .closest('tr')
        .findByRole('button', { name: /delete/i })
        .click()
    })
    cy.findByText(/70\.5 kg/i).should('not.exist')
  })
})
