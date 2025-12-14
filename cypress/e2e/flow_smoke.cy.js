/// <reference types="cypress" />

describe('Frontend smoke', () => {
  it('loads home and navbar', () => {
    cy.visit('/');
    cy.contains('HopShare');
    cy.contains('Home').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('logs in via UI (happy path)', () => {
    cy.visit('/');
    cy.contains('Login').click();

    cy.get('input[name="email"]').clear().type('alice@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();

    // Expect redirect to home with protected links visible
    cy.contains('Welcome to HopShare').should('be.visible'); // ensure login completed
    cy.url().should('include', '/');
    cy.contains('Routes').should('be.visible');
    cy.contains('Requests').should('be.visible');
    cy.contains('Reviews').should('be.visible');
  });
});

