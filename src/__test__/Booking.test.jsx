import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingInfo from "../components/BookingInfo/BookingInfo";
import Booking from "../views/Booking";
import { MemoryRouter } from "react-router-dom";
import { server } from "../__mocks__/server";
import { rest } from "msw";

describe("BookingInfo Component", () => {
  it("should allow the user to select a date", () => {
    const updateBookingDetails = vi.fn();
    render(
      <MemoryRouter>
        <BookingInfo updateBookingDetails={updateBookingDetails} />
      </MemoryRouter>
    );

    // Find the date input
    const dateInput = screen.getByLabelText(/Date/i);

    // Simulate changing the date
    fireEvent.change(dateInput, { target: { value: "2024-12-20" } });

    // Verify that the value of the input has changed correctly
    expect(dateInput.value).toBe("2024-12-20");
  });

  it("should allow the user to select a time", () => {
    const updateBookingDetails = vi.fn();
    render(
      <MemoryRouter>
        <BookingInfo updateBookingDetails={updateBookingDetails} />
      </MemoryRouter>
    );

    // Find the time input
    const timeInput = screen.getByLabelText(/Time/i);

    // Simulate changing the time
    fireEvent.change(timeInput, { target: { value: "15:00" } });

    // Verify that the value of the input has changed correctly
    expect(timeInput.value).toBe("15:00");
  });

  it("should allow the user to enter the number of players", () => {
    const updateBookingDetails = vi.fn();
    render(
      <MemoryRouter>
        <BookingInfo updateBookingDetails={updateBookingDetails} />
      </MemoryRouter>
    );

    // Find the players input
    const playersInput = screen.getByLabelText(/Number of awesome bowlers/i);

    // Simulate changing the number of players
    fireEvent.change(playersInput, { target: { value: "3" } });

    // Verify that the value of the number of players has changed correctly
    expect(playersInput.value).toBe("3");
  });

  test("should show a generic error if any required field is not filled", async () => {
    render(
      <MemoryRouter>  {/* Avvolgi il componente con MemoryRouter */}
        <Booking />
      </MemoryRouter>
    );
  
    // Cerca il bottone usando una regex case-insensitive
    const bookingButton = screen.getByRole("button", {
      name: /striiiiiike!/i,  // Regex case-insensitive per il testo del bottone
    });
  
    // Verifica che il bottone sia nel documento
    expect(bookingButton).toBeInTheDocument();
    expect(bookingButton).toBeVisible();
  
    // Simula il click sul bottone
    fireEvent.click(bookingButton);
  
    // A questo punto, puoi verificare che l'azione di booking venga eseguita
    // Per esempio, puoi verificare se viene visualizzato un messaggio di errore o
    // se il booking viene effettivamente inviato.
    await waitFor(() => {
      const errorMessage = screen.getByText(/Alla fälten måste vara ifyllda/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

});
