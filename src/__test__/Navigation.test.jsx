import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Booking from "../views/Booking";
import Navigation from "../components/Navigation/Navigation";
import Confirmation from "../views/Confirmation";
import { spyOnBookingCall } from "../__mocks__/handlers";

beforeEach(() => {
  sessionStorage.clear();
});

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

  it("should allow user to see a message if no confirmation are stored", async () => {
    render(
      <MemoryRouter initialEntries={["/confirmation"]}>
        <Booking />
        <Confirmation />
      </MemoryRouter>
    );

    const navIcon = screen.getAllByRole("img")[0];
    fireEvent.click(navIcon);

    const confirmationLinks = screen.getAllByRole("link", { name: /Confirmation/i });
    const confirmationLink = confirmationLinks[0];
    fireEvent.click(confirmationLink);

    await waitFor(() => {
      const noBookingMessage = screen.getByText((content) => content === "Inga bokning gjord!");
      expect(noBookingMessage).toBeInTheDocument();
    });
  });

  
test('should render Navigation and toggle menu visibility', () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

 
  const navIcon = screen.getAllByRole("img")[0];
  expect(navIcon).toBeInTheDocument();

  const bookingLink = screen.getByText(/Booking/i);
  const confirmationLink = screen.getByText(/Confirmation/i);
  expect(bookingLink).toHaveClass('hide');
  expect(confirmationLink).toHaveClass('hide');

  
  fireEvent.click(navIcon);


  expect(bookingLink).not.toHaveClass('hide');
  expect(confirmationLink).not.toHaveClass('hide');
});

});
