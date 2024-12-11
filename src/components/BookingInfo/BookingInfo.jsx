import "./BookingInfo.scss";

import Input from "../Input/Input";

function BookingInfo({ updateBookingDetails }) {
  return (
    <section className="booking-info" id="booking-info">
      <header>
        <h2 className="booking-info__heading" id="booking-info-heading">When, WHAT & Who</h2>
      </header>
      <form className="booking-info__details" id="booking-info-details">
        <section className="booking-info__when" id="booking-info-when">
          <Input
            label="Date"
            type="date"
            customClass="booking-info__date"
            name="when"
            id="booking-info-date"
            handleChange={updateBookingDetails}
          />
          <Input
            label="Time"
            type="time"
            name="time"
            id="booking-info-time"
            handleChange={updateBookingDetails}
          />
        </section>
        <Input
          label="Number of awesome bowlers"
          type="number"
          customClass="booking-info__who"
          name="people"
          id="booking-info-people"
          handleChange={updateBookingDetails}
          maxLength={2}
        />
        <Input
          label="Number of lanes"
          type="number"
          customClass="booking-info__lanes"
          name="lanes"
          id="booking-info-lanes"
          handleChange={updateBookingDetails}
          maxLength={2}
        />
      </form>
    </section>
  );
}

export default BookingInfo;
