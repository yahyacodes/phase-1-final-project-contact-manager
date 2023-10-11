document.addEventListener("DOMContentLoaded", () => {});

const searchInput = document.querySelector("[data-search]");
const addContact = document.querySelector(".add-contact");

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

const addNewContact = () => {
  const newContact = document.querySelector(".new-contact");
  const newCard = document.createElement("li");
  newCard.className = "new-contact-card";
  newCard.innerHTML = `
  <input type="text" class='firstname-input' placeholder="First Name" />
  <input type="text" class='lastname-input' placeholder="Last Name" />
  <input type="number" class='number-input' placeholder="Number" />
  <input type="email" class='email-input' placeholder="Email" />
  <br/>
  <button class="save-contact">Save</button>
  <button class="go-back">Back</button>
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

  const goBack = document.querySelector(".go-back");
  goBack.addEventListener("click", () => {
    location.reload();
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

let nameField = document.querySelector(".name-input-field");
let numberField = document.querySelector(".number-input-field");
let emailField = document.querySelector(".email-input-field");

const fetchContacts = () => {
  const contactList = document.querySelector(".contact-list");
  const contactDetails = document.querySelector(".contact-details");
  fetch("http://localhost:3000/contacts")
    .then((res) => res.json())
    .then(
      (data) =>
        (searchContact = data.map((contact) => {
          const card = document.createElement("li");
          card.className = "card";
          card.innerHTML = `
        <h4>${contact.firstName} ${contact.lastName}</h4>
        `;
          card.addEventListener("click", () => {
            contactList.style.display = "none";
            const cardDetails = document.createElement("li");
            cardDetails.className = "card-details";
            cardDetails.innerHTML = `
          <h4>${contact.firstName} ${contact.lastName}</h4>
          <p>${contact.phoneNumber}</p>
          <p>${contact.email}</p>
          <button class="edit-contact">Edit</button>
          <button class="delete-contact">Delete</button>
          <button class="go-back">Back</button>
          `;
            contactDetails.appendChild(cardDetails);

            const deleteContact = document.querySelector(".delete-contact");
            deleteContact.addEventListener("click", () => {
              cardDetails.remove();
              location.reload();
              contactList.style.display = "block";
              deleteContacts(contact.id);
              console.log("Delete button");
            });

            const goBack = document.querySelector(".go-back");
            goBack.addEventListener("click", () => {
              location.reload();
            });
          });
          contactList.appendChild(card);
          return {
            firstName: contact.firstName,
            lastName: contact.lastName,
            element: card,
          };
        }))
    );
  addContact.addEventListener("click", () => {
    contactList.style.display = "none";
    addNewContact();
  });
};

fetchContacts();

const deleteContacts = (id) => {
  fetch(`http://localhost:3000/contacts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};
