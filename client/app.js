const Device = Twilio.Device;
const simplePhoneNumberRegexp = /^\+[1-9]\d{1,14}$/;

const init = async () => {
  const phoneNumInput = document.getElementById("phone-number");
  const dialBtn = document.getElementById("dial");
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error");
  errorMessage.innerText =
    "Please enter the full phone number including  international code.";

  const token = await fetch("/token", { method: "POST" }).then(res =>
    res.json()
  );
  const device = new Device(token.token, { debug: true });
  device.on("ready", function(device) {
    let connection = null;

    dialBtn.addEventListener("click", () => {
      errorMessage.remove();
      if (connection === null) {
        const phoneNumber = phoneNumInput.value;
        if (simplePhoneNumberRegexp.test(phoneNumber)) {
          connection = device.connect({ To: phoneNumber });
          connection.on("disconnect", () => {
            connection = null;
            dialBtn.innerText = "Dial";
          });
          dialBtn.innerText = "Hang up";
        } else {
          phoneNumInput.insertAdjacentElement("afterend", errorMessage);
        }
      } else {
        connection.disconnect();
        connection = null;
        dialBtn.innerText = "Dial";
      }
    });
  });

  // Contact Picker code goes here.
};

window.addEventListener("DOMContentLoaded", init);
