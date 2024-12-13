import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Booking from "../views/Booking";
import Confirmation from "../views/Confirmation";
import { spyOnBookingCall } from "../__mocks__/handlers";

beforeEach(() => {
  global.sessionStorage = {
    setItem: vi.fn(),
    getItem: vi.fn(),
    clear: vi.fn(),
  };
});

describe("Confirmation process", () => {
  it("should allow user to see a message if no confirmation are stored", async () => {
    
    const confirmationDetails = {
      when: "2024-12-11T18:00:00",
      people: "3",
      lanes: "1",
      id: "123456",
      price: "460",
    };

    
    global.sessionStorage.getItem = vi.fn((key) =>
      key === "confirmation" ? JSON.stringify(confirmationDetails) : null
    );

    
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Booking />
        <Confirmation />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: "3" } });

    const shoeButton = screen.getByText("+");
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);

    const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
    fireEvent.change(shoeInputs[0], { target: { value: "38" } });
    fireEvent.change(shoeInputs[1], { target: { value: "40" } });
    fireEvent.change(shoeInputs[2], { target: { value: "42" } });

    fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/When/i), { target: { value: "2024-12-11 18:00" } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });

    const bookingButton = screen.getByRole("button", { name: /striiiiiike!/i });
    fireEvent.click(bookingButton);

    const navIcon = screen.getAllByRole("img")[0];
    fireEvent.click(navIcon);

    const confirmationLinks = screen.getAllByRole("link", { name: /Confirmation/i });
    const confirmationLink = confirmationLinks[0];
    fireEvent.click(confirmationLink);

    const whenInput = screen.getByLabelText(/When/i);
    expect(whenInput).toBeInTheDocument();

    const whoInput = screen.getByLabelText(/Who/i);
    expect(whoInput).toBeInTheDocument();

    const lanesInput = screen.getByLabelText(/Lanes/i);
    expect(lanesInput).toBeInTheDocument();

    const bookingNumberInput = screen.getByLabelText(/Booking number/i);
    expect(bookingNumberInput).toBeInTheDocument();

    const priceElement = screen.getByText(/Total:/i);
    expect(priceElement).toBeInTheDocument();
    const priceValue = priceElement.nextElementSibling;

    const button = screen.getByRole("button", { name: /Sweet, let's go!/i });
    expect(button).toBeInTheDocument();
  });
});
