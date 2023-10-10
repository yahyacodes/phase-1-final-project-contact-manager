document.addEventListener("DOMContentLoaded", () => {});

const searchInput = document.querySelector(".search-input");
const addContact = document.querySelector("[data-search]");

let searchContact = [];

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  searchContact.forEach((contact) => {
    if (
      contact.firstName.toLowerCase().includes(value) ||
      contact.lastName.toLowerCase().includes(value)
    ) {
      contact.element.style.display = "block";
    } else {
      contact.element.style.display = "none";
    }
  });
});

addContact.addEventListener("click", () => {
  //   addNewContact();
});

const addNewContact = () => {
  const newContact = document.querySelector(".new-contact");
  const newCard = document.createElement("li");
  newCard.className = "new-contact-card";
  newCard.innerHTML = `
  <input type="text" class='firstname-input' placeholder="First Name" />
  <input type="text" class='lastname-input' placeholder="Last Name" />
  <input type="number" class='number-input' placeholder="Number" />
  <input type="email" class='email-input' placeholder="Email" />
  <button class="save-contact">Save</button>
    `;
  newContact.appendChild(newCard);
  document.querySelector(".save-contact").addEventListener("click", () => {
    const firstNameVal = document.querySelector(".firstname-input").value;
    const lastNameVal = document.querySelector(".lastname-input").value;
    const numberVal = document.querySelector(".number-input").value;
    const emailVal = document.querySelector(".email-input").value;
    let newData = {
      firstName: firstNameVal,
      lastName: lastNameVal,
      email: emailVal,
      phoneNumber: numberVal,
    };
    if (firstNameVal || lastNameVal || numberVal || emailVal === "") {
      alert("Please fill in all the input fields");
    } else {
      addContacts(newData);
    }
  });
};

const addContacts = (newData) => {
  fetch("http://localhost:3000/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

const fetchContacts = () => {
  fetch("http://localhost:3000/contacts")
    .then((res) => res.json())
    .then(
      (data) =>
        (searchContact = data.map((contact) => {
          const contactList = document.querySelector(".contact-list");
          const card = document.createElement("li");
          card.className = "card";
          card.innerHTML = `
        <h4>${contact.firstName} ${contact.lastName}</h4>
        <p>${contact.phoneNumber}</p>
        `;
          contactList.appendChild(card);
          return {
            firstName: contact.firstName,
            lastName: contact.lastName,
            element: card,
          };
        }))
    );
};

fetchContacts();
