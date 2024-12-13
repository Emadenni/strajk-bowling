import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, BrowserRouter, Route, Routes } from "react-router-dom";
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
  it("should allow the user to complete the booking by clicking a button", async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: "3" } });

    const shoeButton = screen.getByText("+");
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);

    expect(screen.getAllByText(/Shoe size \/ person/i).length).toBe(3);

    const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
    fireEvent.change(shoeInputs[0], { target: { value: "38" } });
    fireEvent.change(shoeInputs[1], { target: { value: "40" } });
    fireEvent.change(shoeInputs[2], { target: { value: "42" } });

    fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-12-11" } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });

    const bookingButton = screen.getByRole("button", { name: /striiiiiike!/i });
    fireEvent.click(bookingButton);

    await waitFor(() => {
      expect(spyOnBookingCall).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(global.sessionStorage.setItem).toHaveBeenCalledWith("confirmation", expect.stringContaining("id"));
    });
  });

  it("should generate and display a booking ID on the confirmation page", async () => {
    render(
      <MemoryRouter initialEntries={["/booking"]}>
        <Routes>
          <Route path="/booking" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: "3" } });

    const shoeButton = screen.getByText("+");
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);

    expect(screen.getAllByText(/Shoe size \/ person/i).length).toBe(3);

    const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
    fireEvent.change(shoeInputs[0], { target: { value: "38" } });
    fireEvent.change(shoeInputs[1], { target: { value: "40" } });
    fireEvent.change(shoeInputs[2], { target: { value: "42" } });

    fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-12-11" } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });

    const bookingButton = screen.getByRole("button", { name: /striiiiiike!/i });
    fireEvent.click(bookingButton);

    await waitFor(() => {
      expect(spyOnBookingCall).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(global.sessionStorage.setItem).toHaveBeenCalledWith("confirmation", expect.stringContaining("id"));
    });

    const bookingIdInput = screen.getByLabelText(/Booking number/i);
    expect(bookingIdInput).toBeInTheDocument();
    expect(bookingIdInput).toHaveAttribute("value", expect.stringMatching(/\w+/));
  });

  it("should generate and display the total price on the confirmation page", async () => {
    render(
      <MemoryRouter initialEntries={["/booking"]}>
        <Routes>
          <Route path="/booking" element={<Booking />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: "3" } });

    const shoeButton = screen.getByText("+");
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);

    expect(screen.getAllByText(/Shoe size \/ person/i).length).toBe(3);

    const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
    fireEvent.change(shoeInputs[0], { target: { value: "38" } });
    fireEvent.change(shoeInputs[1], { target: { value: "40" } });
    fireEvent.change(shoeInputs[2], { target: { value: "42" } });

    fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-12-11" } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });

    const bookingButton = screen.getByRole("button", { name: /striiiiiike!/i });
    fireEvent.click(bookingButton);

    await waitFor(() => {
      expect(global.sessionStorage.setItem).toHaveBeenCalledWith("confirmation", expect.stringContaining("price"));
    });

    const priceElement = screen.getByText(/Total:/i);
    const priceText = priceElement.nextElementSibling;

    const expectedPrice = "460 sek";
    expect(priceText).toHaveTextContent(expectedPrice);
  });

  it("should render all the input fields on the confirmation page", () => {
    
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
      <MemoryRouter>
        <Confirmation />
      </MemoryRouter>
    );

    const whenInput = screen.getByLabelText(/When/i);
    expect(whenInput).toBeInTheDocument();
    expect(whenInput.value).toBe("2024-12-11 18:00:00");

    const whoInput = screen.getByLabelText(/Who/i);
    expect(whoInput).toBeInTheDocument();
    expect(whoInput.value).toBe("3");

    const lanesInput = screen.getByLabelText(/Lanes/i);
    expect(lanesInput).toBeInTheDocument();
    expect(lanesInput.value).toBe("1");

    const bookingNumberInput = screen.getByLabelText(/Booking number/i);
    expect(bookingNumberInput).toBeInTheDocument();
    expect(bookingNumberInput.value).toBe("123456");

    const priceElement = screen.getByText(/Total:/i);
    expect(priceElement).toBeInTheDocument();
    const priceValue = priceElement.nextElementSibling;
    expect(priceValue).toHaveTextContent("460 sek");

    // Verifica bottone
    const button = screen.getByRole("button", { name: /Sweet, let's go!/i });
    expect(button).toBeInTheDocument();
  });
});
