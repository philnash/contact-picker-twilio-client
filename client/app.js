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

  if ("contacts" in navigator && "ContactsManager" in window) {
    const mainElt = document.getElementsByTagName("main")[0];
    const contactsBtn = document.createElement("button");
    contactsBtn.innerText = "Choose contact";
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
          const contactNumber = contact.tel.filter(tel => tel.length > 0)[0];
          const contactName = contact.name.filter(name => name.length > 0)[0];
          if (contactNumber) {
            phoneNumInput.value = contactNumber.replace(/\s/g, "");
            dialBtn.innerText = `Dial ${contactName}`;
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
    mainElt.appendChild(contactsBtn);
  } else {
    const notSupported = document.createElement("p");
    notSupported.classList.add("error");
    notSupported.innerText =
      "Sorry, the contact picker API is not supported in your browser.";
    dialBtn.insertAdjacentElement("afterend", notSupported);
  }
};

window.addEventListener("DOMContentLoaded", init);
