/* import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BookingInfo from "../components/BookingInfo/BookingInfo";
import Booking from "../views/Booking";
import Confirmation from "../views/Confirmation";
import { MemoryRouter } from "react-router-dom";
import { server } from "../__mocks__/server";
import { http, HttpResponse } from "msw";

describe("Booking tests", () => {
  it("should send booking request and show confirmation", async () => {
    const mockBooking = {
      when: "2024-12-20",
      time: "15:00",
      people: "3",
      lanes: "2",
      shoes: "yes",
    };

    // Simula la risposta della API
    server.use(
      http.post("https://mock.api.example.com/book", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ id: "123ABC", ...mockBooking, price: 500 }));
      })
    );

    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    // Simula l'interazione con il form
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-12-20" } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "15:00" } });
    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: /striiiiiike!/i }));

    // Aspetta che la risposta venga mostrata
    await waitFor(() => screen.getByText(/See you soon!/i));

    expect(screen.getByText("123ABC")).toBeInTheDocument(); // Verifica che l'ID della prenotazione sia nel DOM
  });
});
 */