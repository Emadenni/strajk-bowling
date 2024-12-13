import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Booking from "../views/Booking"; // Il componente Booking
import Confirmation from "../views/Confirmation";
import { spyOnBookingCall } from "../__mocks__/handlers";

describe("navigation component", async () => {
  it("should navigate to Confirmation page after booking is completed", async () => {
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
      expect(screen.getByText(/See you soon!/i)).toBeInTheDocument();
    });
  });
});
