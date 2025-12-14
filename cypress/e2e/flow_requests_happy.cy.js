/// <reference types="cypress" />

/**
 * Happy Path #2:
 * - Login
 * - Go to Requests
 * - Create → Edit → Delete a request
 * Screens: Login, Home, Requests (Create/Edit/Delete modal)
 */
describe('Manage Requests (happy path)', () => {
  it('creates, edits and deletes a request', () => {
    // Login
    cy.visit('/');
    cy.contains('Login').click();
    cy.get('input[name="email"]').clear().type('alice@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();

    // Requests
    cy.contains('Welcome to HopShare').should('be.visible'); // ensure login completed
    cy.contains('Requests').click();
    cy.url().should('include', '/requests');

    // Create
    cy.contains('Create Request').click();
    cy.get('input[name="Start"]').type('City A');
    cy.get('input[name="End"]').type('City B');
    cy.get('input[name="DateAndTime"]').type('2031-01-01T09:00'); // datetime-local
    cy.get('textarea[name="Description"]').type('Morning ride needed');
    cy.contains('button[type="submit"]', 'Create').click();

    cy.contains('.card', 'City A → City B').should('be.visible');

    // Edit
    cy.contains('.card', 'City A → City B').within(() => cy.contains('Edit').click());
    cy.get('input[name="End"]').clear().type('City C');
    cy.contains('button', 'Update').click();
    cy.contains('.card', 'City A → City C').should('be.visible');

    // Delete
    cy.contains('.card', 'City A → City C').within(() => cy.contains('Delete').click());
    cy.contains('Delete Request').should('be.visible');
    cy.contains('Yes').click();
    cy.contains('City A → City C').should('not.exist');
  });
});

