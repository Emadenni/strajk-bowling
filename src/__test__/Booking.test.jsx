import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BookingInfo from "../components/BookingInfo/BookingInfo";
import Booking from "../views/Booking";
import { MemoryRouter } from "react-router-dom";
import { server } from "../__mocks__/server";
import { http } from "msw";

describe("BookingInfo Component", () => {
  it("should allow the user to select a date", () => {
    const updateBookingDetails = vi.fn();
    render(
      <MemoryRouter>
        <BookingInfo updateBookingDetails={updateBookingDetails} />
      </MemoryRouter>
    );
    const dateInput = screen.getByLabelText(/Date/i);
    fireEvent.change(dateInput, { target: { value: "2024-12-20" } });
    expect(dateInput.value).toBe("2024-12-20");
  });

  it("should allow the user to select a time", () => {
    const updateBookingDetails = vi.fn();
    render(
      <MemoryRouter>
        <BookingInfo updateBookingDetails={updateBookingDetails} />
      </MemoryRouter>
    );
    const timeInput = screen.getByLabelText(/Time/i);
    fireEvent.change(timeInput, { target: { value: "15:00" } });
    expect(timeInput.value).toBe("15:00");
  });

  it("should allow the user to enter the number of players", () => {
    const updateBookingDetails = vi.fn();
    render(
      <MemoryRouter>
        <BookingInfo updateBookingDetails={updateBookingDetails} />
      </MemoryRouter>
    );
    const playersInput = screen.getByLabelText(/Number of awesome bowlers/i);
    fireEvent.change(playersInput, { target: { value: "3" } });
    expect(playersInput.value).toBe("3");
  });

  describe("Booking Flow", () => {
    it("should show a generic error if any required field is not filled", async () => {
      server.use(
        http.post("https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com", (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ message: "Booking confirmed" }));
        })
      );

      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      const bookingButton = screen.getByRole("button", {
        name: /striiiiiike!/i,
      });
      expect(bookingButton).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: "5" } });

      const shoeButton = screen.getByText("+");
      fireEvent.click(shoeButton);
      fireEvent.click(shoeButton);
      fireEvent.click(shoeButton);
      fireEvent.click(shoeButton);
      fireEvent.click(shoeButton);

      expect(screen.getAllByText(/Shoe size \/ person/i).length).toBe(5);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
      shoeInputs.forEach((input, index) => {
        fireEvent.change(input, { target: { value: 38 + index * 2 } });
      });

      fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "2" } });
      fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "" } });
      fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });

      fireEvent.click(bookingButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/Alla fälten måste vara ifyllda/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });

    it("should show an error if the number of players exceeds the available lanes capacity", async () => {
      server.use(
        http.post("https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com", (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ message: "Booking confirmed" }));
        })
      );

      render(
        <MemoryRouter>
          <Booking />
        </MemoryRouter>
      );

      const bookingButton = screen.getByRole("button", {
        name: /striiiiiike!/i,
      });
      expect(bookingButton).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: "5" } });

      const shoeButton = screen.getByText("+");
      fireEvent.click(shoeButton);
      fireEvent.click(shoeButton);
      fireEvent.click(shoeButton);
      fireEvent.click(shoeButton);
      fireEvent.click(shoeButton);

      expect(screen.getAllByText(/Shoe size \/ person/i).length).toBe(5);

      const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
      shoeInputs.forEach((input, index) => {
        fireEvent.change(input, { target: { value: 38 + index * 2 } });
      });

      fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });
      fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-12-11" } });
      fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });

      fireEvent.click(bookingButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/det får max vara 4 spelare per bana/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });
});
