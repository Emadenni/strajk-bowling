import { http, HttpResponse } from "msw";

export const handlers = [
  
  http.post("https://mock.api.example.com", async ({ request }) => {
    const booking = await request.json();

    const price = 
      parseInt(booking.people || 0) * 120 + 
      parseInt(booking.lanes || 0) * 100;
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();

    
    const confirmation = {
      id,
      when: booking.when,
      lanes: booking.lanes,
      people: booking.people,
      shoes: booking.shoes || [],
      price,
      active: true,
    };

   
    sessionStorage.setItem("confirmation", JSON.stringify(confirmation));
    return HttpResponse.json(confirmation);
  }),

  
  http.get("https://mock.api.example.com/confirmation", () => {
    const storedConfirmation = sessionStorage.getItem("confirmation");

    if (!storedConfirmation) {
      return HttpResponse.error(404, "No confirmation found");
    }

    return HttpResponse.json(JSON.parse(storedConfirmation));
  }),
];
