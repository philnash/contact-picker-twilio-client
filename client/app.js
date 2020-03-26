const Device = Twilio.Device;

const init = async () => {
  const phoneNumInput = document.getElementById("phone-number");
  const dialBtn = document.getElementById("dial");
  const mainElt = document.getElementsByTagName("main")[0];
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

  if ("contacts" in navigator && "ContactsManager" in window) {
    const contactsBtn = document.createElement("button");
    contactsBtn.innerText = "Choose contact";
    mainElt.appendChild(contactsBtn);

    contactsBtn.addEventListener("click", async () => {
      try {
        const contactProperties = ["name", "tel"];
        const options = { multiple: false };
        const contacts = await navigator.contacts.select(
          contactProperties,
          options
        );
        if (contacts.length > 0) {
          const contact = contacts[0];
          const contactNumber = contact.tel[0];
          const contactName = contact.name[0];
          if (contactNumber) {
            phoneNumInput.value = contactNumber.replace(/\s/g, "");
            dialBtn.innerText = `Dial ${contactName}`;
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
};

window.addEventListener("DOMContentLoaded", init);
