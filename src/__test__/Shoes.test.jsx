import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Shoes from "../components/Shoes/Shoes";
import { MemoryRouter } from "react-router-dom";
import Booking from "../views/Booking";
import { spyOnBookingCall } from "../__mocks__/handlers";


describe("Shoes Component", () => {
  it("should allow the user to add a shoe and fill the shoe size input field", () => {
    const addShoe = vi.fn();
    const shoes = [{ id: "1" }];

    render(<Shoes updateSize={vi.fn()} addShoe={addShoe} shoes={shoes} removeShoe={vi.fn()} />);

    const inputFields = screen.getAllByLabelText(/Shoe size \/ person/i);
    expect(inputFields).toHaveLength(1);

    const addButton = screen.getByText("+");
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(addShoe).toHaveBeenCalledTimes(1);
  });

  it("User should be able to change the shoe size for each player", () => {
    const updateSize = vi.fn();
    const addShoe = vi.fn();

    const shoes = [{ id: "1", size: "" }];

    render(<Shoes updateSize={updateSize} addShoe={addShoe} shoes={shoes} removeShoe={vi.fn()} />);

    const inputSize = screen.getByLabelText(/Shoe size \/ person 1/i);
    expect(inputSize).toBeInTheDocument();

    fireEvent.change(inputSize, { target: { value: "42", name: "1" } });

    expect(updateSize).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: "42",
          name: "1",
        }),
      })
    );
  });

  it("should allow user to choose the shoe size for each player", async () => {
    const addShoe = vi.fn();
    const updateSize = vi.fn();
    const removeShoe = vi.fn();

    const shoes = [{ id: "1" }, { id: "2" }, { id: "3" }];

    render(<Shoes updateSize={updateSize} addShoe={addShoe} shoes={shoes} removeShoe={removeShoe} />);

    const shoeButton = screen.getByText("+");
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);

    await waitFor(() => {
      expect(addShoe).toHaveBeenCalledTimes(3);
    });
  });

  it("should show an error message if a shoe size is not filled", async () => {
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

    fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-12-11" } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });

    const bookingButton = screen.getByRole("button", { name: /striiiiiike!/i });
    fireEvent.click(bookingButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Alla skor måste vara ifyllda/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("should show an error message if number of players doesn't match with chosen number of shoes", async () => {
    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: "4" } });

    const shoeButton = screen.getByText("+");
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);

    expect(screen.getAllByText(/Shoe size \/ person/i).length).toBe(3);

    const shoeInputs = screen.getAllByLabelText(/Shoe size \/ person/i);
    fireEvent.change(shoeInputs[0], { target: { value: "38" } });
    fireEvent.change(shoeInputs[1], { target: { value: "40" } });
    fireEvent.change(shoeInputs[1], { target: { value: "40" } });

    fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-12-11" } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });

    const bookingButton = screen.getByRole("button", { name: /striiiiiike!/i });
    fireEvent.click(bookingButton);

    await waitFor(() => {
      const errorMessage = screen.getByText(/Antalet skor måste stämma överens med antal spelare/i);
      expect(errorMessage).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(spyOnBookingCall).not.toHaveBeenCalled();
    });
  });

  it("should allow user to be see an overview where he can check shoes sizes before confirm booking", async () => {
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
    fireEvent.change(shoeInputs[1], { target: { value: "40" } });

    fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: "2024-12-11" } });
    fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: "18:00" } });

    const bookingButton = screen.getByRole("button", {
      name: /striiiiiike!/i,
    });
    fireEvent.click(bookingButton);

    await waitFor(() => {
      expect(screen.getAllByText(/Shoe size \/ person/i)).not.toHaveLength(0);
    });
  });

  it("should allow the user to remove shoe size inputs", async () => {
    const addShoe = vi.fn();
    const updateSize = vi.fn();
    const removeShoe = vi.fn();

    const shoes = [{ id: "1" }, { id: "2" }];

    render(<Shoes updateSize={updateSize} addShoe={addShoe} shoes={shoes} removeShoe={removeShoe} />);

    const shoeButton = screen.getByText("+");
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);
    fireEvent.click(shoeButton);

    await waitFor(() => {
      expect(addShoe).toHaveBeenCalledTimes(3);
    });

  
    fireEvent.click(screen.getAllByText("-")[0]);

    await waitFor(() => {
      expect(screen.getAllByLabelText(/Shoe size \/ person/i)).toHaveLength(2);
    });
  });
});
