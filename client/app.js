const Device = Twilio.Device;

const init = async () => {
  const phoneNumInput = document.getElementById("phone-number");
  const dialBtn = document.getElementById("dial");
  const token = await fetch("/token", { method: "POST" }).then(res =>
    res.json()
  );
  const device = new Device(token.token, { debug: true });
  device.on("ready", function(device) {
    let connection = null;

    dialBtn.addEventListener("click", () => {
      if (connection === null) {
        const phoneNumber = phoneNumInput.value;
        connection = device.connect({ To: phoneNumber });
        connection.on("disconnect", () => {
          connection = null;
          dialBtn.innerText = "Dial";
        });
        dialBtn.innerText = "Hang up";
      } else {
        connection.disconnect();
        connection = null;
        dialBtn.innerText = "Dial";
      }
    });
  });
};

window.addEventListener("DOMContentLoaded", init);
