/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

describe('User Profile', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password')
    cy.visit('/profile')
  })

  it('should display user information', () => {
    cy.findByText(/test user/i).should('exist')
    cy.findByText(/test@example.com/i).should('exist')
  })

  it('should allow updating profile information', () => {
    cy.findByRole('button', { name: /edit profile/i }).click()
    cy.findByLabelText(/name/i).clear().type('Updated Name')
    cy.findByRole('button', { name: /save/i }).click()
    cy.findByText(/updated name/i).should('exist')
    cy.findByText(/profile updated/i).should('exist')
  })

  it('should validate password change', () => {
    cy.findByRole('button', { name: /change password/i }).click()
    cy.findByLabelText(/current password/i).type('wrongpassword')
    cy.findByLabelText(/new password/i).type('newpassword123')
    cy.findByLabelText(/confirm password/i).type('newpassword123')
    cy.findByRole('button', { name: /update password/i }).click()
    cy.findByText(/current password is incorrect/i).should('exist')
  })

  it('should handle error states', () => {
    cy.intercept('PUT', '/api/profile', {
      statusCode: 500,
      body: { message: 'Server error' }
    })
    cy.findByRole('button', { name: /edit profile/i }).click()
    cy.findByLabelText(/name/i).clear().type('Updated Name')
    cy.findByRole('button', { name: /save/i }).click()
    cy.findByText(/error updating profile/i).should('exist')
  })
})
