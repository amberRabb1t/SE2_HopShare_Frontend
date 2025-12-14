/// <reference types="cypress" />

/**
 * Happy Path #1:
 * - Login
 * - Go to Routes
 * - Create → Edit → Delete a route
 * Screens: Login, Home, Routes (Create/Edit/Delete modal)
 */
describe('Manage Routes (happy path)', () => {
  it('creates, edits and deletes a route', () => {
    // Login
    cy.visit('/');
    cy.contains('Login').click();
    cy.get('input[name="email"]').clear().type('alice@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();

    // Routes
    cy.contains('Welcome to HopShare').should('be.visible'); // ensure login completed
    cy.contains('Routes').click();
    cy.url().should('include', '/routes');

    // Create
    cy.contains('Create Route').click();
    cy.get('input[name="Start"]').type('Springfield');
    cy.get('input[name="End"]').type('Shelbyville');
    cy.get('input[name="Stops"]').type('Monorail Station');
    cy.get('input[name="DateAndTime"]').type('2030-12-31T18:30'); // datetime-local
    cy.get('input[name="OccupiedSeats"]').clear().type('2');
    cy.get('textarea[name="Comment"]').type('Evening commute');
    cy.contains('button[type="submit"]', 'Create').click();

    // Verify appears
    cy.contains('Springfield → Shelbyville').should('be.visible');
    cy.contains('Stops: Monorail Station').should('be.visible');
    cy.contains('Seats occupied: 2').should('be.visible');

    // Edit
    cy.contains('.card', 'Springfield → Shelbyville').within(() => {
      cy.contains('Edit').click();
    });
    cy.get('input[name="OccupiedSeats"]').clear().type('3');
    cy.contains('button', 'Update').click();
    cy.contains('Seats occupied: 3').should('be.visible');

    // Delete
    cy.contains('.card', 'Springfield → Shelbyville').within(() => {
      cy.contains('Delete').click();
    });
    cy.contains('Delete Route').should('be.visible');
    cy.contains('Yes').click();
    cy.contains('Springfield → Shelbyville').should('not.exist');
  });
});

