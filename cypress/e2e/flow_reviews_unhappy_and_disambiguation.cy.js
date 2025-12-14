/// <reference types="cypress" />

/**
 * Unhappy Path + Disambiguation Happy Path:
 * - Unhappy: try to post review with missing username -> form error
 * - Disambiguation: enter a username that yields multiple matches -> expect selection UI (UserSelectModal)
 * Screens: Login, Home, Reviews (Write Review modal + UserSelectModal)
 *
 * Note: This test assumes your backend returns multiple users when querying by Name
 * (e.g., "Alex" has duplicates). If not, replace "Alex" with another known duplicated name.
 */
describe('Reviews (unhappy + disambiguation happy path)', () => {
  it('shows validation error when ReviewedUserName is missing (unhappy path)', () => {
    // Login
    cy.visit('/');
    cy.contains('Login').click();
    cy.get('input[name="email"]').clear().type('alice@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();

    // Reviews
    cy.contains('Welcome to HopShare').should('be.visible'); // ensure login completed
    cy.contains('Reviews').click();
    cy.url().should('include', '/reviews');

    cy.contains('Write Review').click();
    // Leave ReviewedUserName empty
    cy.get('textarea[name="Description"]').type('Validation error check');
    cy.contains('button', 'Post').click();

    cy.contains('.form-error', /Target username required/i).should('be.visible');
  });

  it('prompts disambiguation for duplicate usernames and posts review (happy path)', () => {
    // Login
    cy.visit('/');
    cy.contains('Login').click();
    cy.get('input[name="email"]').clear().type('alice@example.com');
    cy.get('input[name="password"]').clear().type('password123');
    cy.get('button[type="submit"]').click();

    // Reviews
    cy.contains('Welcome to HopShare').should('be.visible'); // ensure login completed
    cy.contains('Reviews').click();
    cy.contains('Write Review').click();

    // Fill form
    cy.get('input[name="ReviewedUserName"]').type('Charlie'); // should be a duplicated name in your backend
    cy.get('select[name="UserType"]').select('Driver');
    cy.get('textarea[name="Description"]').clear().type('Great ride with Charlie!');
    cy.contains('.rating-stars button', '5').click();
    cy.contains('button', 'Post').click();

    // Expect the disambiguation modal to appear
    cy.contains('Select User').should('be.visible');

    // Pick the first candidate (card visible)
    cy.get('.card[role="button"]').first().click();

    // After posting, the review should appear in "My Reviews"
    cy.contains('My Reviews').should('be.visible');
    cy.contains('Great ride with Charlie!').should('be.visible');
  });
});

