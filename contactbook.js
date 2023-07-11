let contacts = [];

function displayContacts() {
    const contactsContainer = document.getElementById('contactsContainer');
    contactsContainer.innerHTML = '';

    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    const filteredContacts = contacts.filter(contact => {
        const nameMatch = contact.name.toLowerCase().includes(searchTerm);
        const phoneMatch = contact.phone.toLowerCase().includes(searchTerm);
        return nameMatch || phoneMatch;
    });

    const sortedContacts = filteredContacts.sort((a, b) => {
        if (a.favorite && !b.favorite) {
            return -1;
        }
        if (!a.favorite && b.favorite) {
            return 1;
        }
        return a.name.localeCompare(b.name);
    });

    sortedContacts.forEach(contact => {
        const contactCard = document.createElement('div');
        contactCard.className = 'contact-card';

        const avatar = document.createElement('img');
        avatar.src = contact.avatar || 'avatar.png';
        avatar.alt = 'Avatar';
        avatar.className = 'contact-avatar';

        const infoContainer = document.createElement('div');
        infoContainer.className = 'contact-card-info';

        const name = document.createElement('span');
        name.className = 'contact-card-name';
        name.textContent = contact.name;

        const phone = document.createElement('span');
        phone.className = 'contact-card-phone';
        phone.textContent = contact.phone;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'contact-card-buttons';

        const deleteButton = document.createElement('img');
        deleteButton.src = 'delete.png';
        deleteButton.alt = 'Удалить';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => deleteContact(contact.id));
        
        const favoriteButton = document.createElement('img');
        favoriteButton.src = contact.favorite ? 'favourite.png' : 'unfavourite.png'; 
        favoriteButton.alt = contact.favorite ? 'Убрать из избранного' : 'В избранное';
        favoriteButton.className = 'favourite-button';
        favoriteButton.addEventListener('click', () => toggleFavorite(contact.id));

        buttonsContainer.appendChild(deleteButton);
        buttonsContainer.appendChild(favoriteButton);

        infoContainer.appendChild(name);
        infoContainer.appendChild(phone);

        contactCard.appendChild(avatar);
        contactCard.appendChild(infoContainer);
        contactCard.appendChild(buttonsContainer);

        contactsContainer.appendChild(contactCard);
    });
}

document.getElementById('searchInput').addEventListener('input', displayContacts);


function addContact(name, phone, favorite, avatar) {
    const newContact = {
        id: contacts.length + 1,
        name: name,
        phone: phone,
        favorite: favorite,
        avatar: avatar
    };

    contacts.push(newContact);

    if (favorite) {
        const index = contacts.findIndex(contact => contact.id === newContact.id);
        if (index > 0) {
            contacts.splice(index, 1);
            contacts.unshift(newContact);
        }
    }

    displayContacts();
}

function deleteContact(contactId) {
    const index = contacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
        contacts.splice(index, 1);
        displayContacts();
    }
}

function toggleFavorite(contactId) {
    const contactIndex = contacts.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
        const contact = contacts[contactIndex];
        contact.favorite = !contact.favorite;

        if (contact.favorite && contactIndex > 0) {
            contacts.splice(contactIndex, 1);
            contacts.unshift(contact);
        }

        displayContacts();
    }
}

document.getElementById('addContactForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = document.getElementById('nameInput');
    const phoneInput = document.getElementById('phoneInput');
    const favoriteInput = document.getElementById('favoriteInput');
    const avatarInput = document.getElementById('avatarInput');

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const favorite = favoriteInput.checked;
    const avatar = avatarInput.files.length > 0 ? URL.createObjectURL(avatarInput.files[0]) : '';

    addContact(name, phone, favorite, avatar);

    nameInput.value = '';
    phoneInput.value = '';
    favoriteInput.checked = false;
    avatarInput.value = '';

    closeModal();
});

document.getElementById('addContactBtn').addEventListener('click', () => openModal());

document.querySelector('.close').addEventListener('click', () => closeModal());

function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

displayContacts();
