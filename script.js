// Adding event listener to window to load content to DOM
document.addEventListener("DOMContentLoaded", () => {});

// Add new contact button $ search input
const searchInput = document.querySelector("[data-search]");
const addContact = document.querySelector(".add-contact");

// Adding search and sort functionality
let searchContact = [];

// Adding event listener to search input
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  // Creating search $ sort functionality
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

// Adding new contact in the application
const addNewContact = () => {
  // Getting the ul from html
  const newContact = document.querySelector(".new-contact");

  // Creating new list
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

  // Appending the elements into the DOM
  newContact.appendChild(newCard);

  // Getting the values from adding new content card
  document.querySelector(".save-contact").addEventListener("click", () => {
    const firstNameVal = document.querySelector(".firstname-input").value;
    const lastNameVal = document.querySelector(".lastname-input").value;
    const numberVal = document.querySelector(".number-input").value;
    const emailVal = document.querySelector(".email-input").value;

    // Assigning the new data from the inputs
    let newData = {
      firstName: firstNameVal,
      lastName: lastNameVal,
      email: emailVal,
      phoneNumber: numberVal,
    };

    // Avoiding submission of empty inputs
    if (
      firstNameVal === "" ||
      lastNameVal === "" ||
      numberVal === "" ||
      emailVal === ""
    ) {
      alert("Please fill in all the input fields");
    } else {
      addContacts(newData);
      location.reload();
    }
  });

  // The go back button
  const goBack = document.querySelector(".go-back");
  goBack.addEventListener("click", () => {
    location.reload();
  });
};

// Edit contact
const updateContact = (contact) => {
  const contactUpdate = document.querySelector(".contact-update");
  const contactCard = document.createElement("li");
  contactCard.className = "contact-card";
  contactCard.innerHTML = `
  <input type="text" class='update-firstname-input' placeholder="First Name" value='${contact.firstName}'/>
  <input type="text" class='update-lastname-input' placeholder="Last Name" value='${contact.lastName}'/>
  <input type="number" class='update-number-input' placeholder="Number" value='${contact.phoneNumber}'/>
  <input type="email" class='update-email-input' placeholder="Email" value='${contact.email}'/>
  <br/>
  <button class="save-update-contact">Update</button>
  `;
  contactUpdate.appendChild(contactCard);

  // Getting the values from adding new content card
  document
    .querySelector(".save-update-contact")
    .addEventListener("click", () => {
      const firstNameInputVal = document.querySelector(
        ".update-firstname-input"
      ).value;
      const lastNameInputVal = document.querySelector(
        ".update-lastname-input"
      ).value;
      const numberInputVal = document.querySelector(
        ".update-number-input"
      ).value;
      const emailInputVal = document.querySelector(".update-email-input").value;

      // Assigning the updated data from the inputs
      let updateData = {
        firstName: firstNameInputVal,
        lastName: lastNameInputVal,
        email: emailInputVal,
        phoneNumber: numberInputVal,
        id: contact.id,
      };
      updateExistingContacts(updateData);
      location.reload();
    });
};

// Rendering the json data to DOM
const fetchContacts = () => {
  // Getting the ul to render the data DOM from html
  const contactList = document.querySelector(".contact-list");
  const contactDetails = document.querySelector(".contact-details");

  // Fetching data from json file
  fetch("http://localhost:3000/contacts")
    .then((res) => res.json())
    .then(
      (data) =>
        (searchContact = data.map((contact) => {
          // Creating the card list to render data from json
          const card = document.createElement("li");
          card.className = "card";
          card.innerHTML = `
        <h4>${contact.firstName} ${contact.lastName}</h4>
        `;

          // Adding event listener to card to see more details of
          // the contact name
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

            // Rendering the data from json to DOM
            contactDetails.appendChild(cardDetails);

            // Adding event listener to edit button
            const editContact = document.querySelector(".edit-contact");
            editContact.addEventListener("click", () => {
              contactDetails.style.display = "none";
              updateContact(contact);
            });

            // Adding event listener to delete button
            const deleteContact = document.querySelector(".delete-contact");
            deleteContact.addEventListener("click", () => {
              cardDetails.remove();
              location.reload();
              contactList.style.display = "block";
              deleteContacts(contact.id);
            });

            // Adding event listener to go back button
            const goBack = document.querySelector(".go-back");
            goBack.addEventListener("click", () => {
              location.reload();
            });
          });

          // Rendering the contact details to DOM
          contactList.appendChild(card);

          // Adding the search $ sort functionality to search input
          return {
            firstName: contact.firstName,
            lastName: contact.lastName,
            element: card,
          };
        }))
    );

  // Adding event listener to add new contact button
  addContact.addEventListener("click", () => {
    contactList.style.display = "none";
    addNewContact();
  });
};

// Calling the fech function to render values to DOM
fetchContacts();

// Putting the values from the input to the json file
const addContacts = (newData) => {
  fetch("http://localhost:3000/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newData),
  })
    .then((res) => res.json())
    .then((data) => data);
};

// Delete function
const deleteContacts = (id) => {
  fetch(`http://localhost:3000/contacts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => data);
};

// update function
const updateExistingContacts = (contact) => {
  fetch(`http://localhost:3000/contacts/${contact.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  })
    .then((res) => res.json())
    .then((data) => data);
};
