import {describe, expect, test} from 'vitest';
import {fireEvent, render, screen} from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe("SearchBar test", () => {
    test("should show the component all the time", () => {
        render(<SearchBar />);

        expect(screen.getByRole("navigation")).toBeDefined()
    })

    test("should show the trip type div on 'trip-type-accordion' click", async () => {
        render(<SearchBar />);
        const tripTypeAccordion = screen.getByTestId("trip-type-accordion");
        fireEvent.click(tripTypeAccordion);

        expect(await screen.getByTestId("trip-type-div"))
    })

    test("should hide the trip type div on 'trip-type-accordion' click when already displayed", async () => {
        render(<SearchBar />);
        const tripTypeAccordion = screen.getByTestId("trip-type-accordion");
        fireEvent.click(tripTypeAccordion);
        fireEvent.click(tripTypeAccordion);

        expect(await screen.queryByTestId("trip-type-div")).toBeNull();
    })

    test("should display the passengers/discount options on passengers infos click", async () => {
        render(<SearchBar />);
        const passengersInfos = screen.getByTestId("passengers-infos");
        fireEvent.click(passengersInfos);

        expect(await screen.getByTestId("passengers_discount_selection_container"))
    })

    test("should hide the passengers/discount options on confirm button click", async () => {
        render(<SearchBar />);
        const passengersInfos = screen.getByTestId("passengers-infos");
        fireEvent.click(passengersInfos);
        const passengersOptionConfirm = screen.getByTestId("passengers-discount-confirm");
        fireEvent.click(passengersOptionConfirm);

        expect(await screen.queryByTestId("passengers_discount_selection_container")).toBeNull();
    })
} )