import cypress from "cypress";

describe("visiting website", () => {
    it("user select a travel, add 2 adults, one senior and one discount card", () => {
        // go to website
        cy.visit('/');
        // search for a city (typing "mar")
        cy.findByTestId("trip-from-input").type('mar');
        // select (margaux) with the keyboard
        cy.findByTestId("trip-from-input")
        .type('{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{downarrow}{enter}');
        // select (paris) for the destination
        cy.findByTestId("trip-to-input").focus();
        cy.findByTestId("trip-to-input").type("par");
        cy.findByTestId("trip-to-input").type("{downarrow}{enter}");
        // click on user icon
        cy.findByTestId("passengers-infos").click();
        // add 2 adults, 1 senior and 1 discount card
        cy.findByTestId("adults-plus-button").click();
        cy.findByTestId("adults-plus-button").click();
        cy.findByTestId("seniors-plus-button").click();
        cy.findByTestId("discount-toggle-button").click();
        // click on confirm
        cy.findByTestId("passengers-discount-confirm").click();
        // click on find my accomodation
        cy.findByTestId("accomodation-toggle-button").click();
    })
})