import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("https://mock.api.example.com", async ({ request }) => {
    const booking = await request.json();

    if (!booking.when || !booking.time || !booking.people || !booking.lanes) {
      return HttpResponse.error(400, "Missing required fields");
    }

    const price = parseInt(booking.people) * 120 + parseInt(booking.lanes) * 100;
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();

    const confirmation = {
      id,
      when: booking.when,
      time: booking.time,
      lanes: booking.lanes,
      people: booking.people,
      shoes: booking.shoes,
      price,
      active: true,
    };

    sessionStorage.setItem("confirmation", JSON.stringify(confirmation));
    return HttpResponse.json(confirmation);
  }),

  http.post("https://mock.api.example.com/checkAvailability", async ({ request }) => {
    const { people, lanes } = await request.json();

    if (!people || !lanes) {
      return HttpResponse.error(400, "Missing required fields");
    }

    const availableLanes = 10; 
    const requiredLanes = Math.ceil(people / 4); 

    if (requiredLanes > availableLanes) {
      return HttpResponse.error(400, "Not enough lanes available for the number of players");
    }

    
    return HttpResponse.json({ availableLanes: availableLanes - requiredLanes, requiredLanes });
  }),

  http.get("https://mock.api.example.com/confirmation", () => {
    const storedConfirmation = sessionStorage.getItem("confirmation");

    if (!storedConfirmation) {
      return HttpResponse.error(404, "No confirmation found");
    }

    return HttpResponse.json(JSON.parse(storedConfirmation));
  }),

  
];
