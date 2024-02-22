const cardsContainer = document.getElementsByClassName("membershipsCardsContainer")[0]

const fetchMemberships = async () => {
    try {
        const response = await fetch(`http://localhost:3000/memberships`);
        const membershipData = await response.json();
        cardsContainer.innerHTML = '';
        membershipData.forEach(membership => {
            const card = document.createElement('div');
            card.setAttribute("class", "membershipCard")
            const headerContainer = document.createElement("div")
            headerContainer.setAttribute("class", "headerContainer")
            const priceName = document.createElement("p")
            const description = document.createElement("p")

            const deleteContainer = document.createElement("div")
            deleteContainer.setAttribute("class", "deleteContainer")
            const deleteButton = document.createElement("button")
            deleteButton.setAttribute("class", "deleteButton");
            deleteButton.setAttribute("data-id", membership._id);
            deleteButton.addEventListener('click', handleDeleteMembership);
           
            const deleteIcon = document.createElement("img")

            priceName.innerText = "$" + membership.price + " " + membership.name
            description.innerText = membership.description

            deleteIcon.setAttribute("src", "trash.svg")
            deleteIcon.setAttribute("class", "trashIcon")

            deleteButton.appendChild(deleteIcon)
            headerContainer.appendChild(priceName)
            headerContainer.appendChild(description)
            deleteContainer.appendChild(deleteButton)
            
            card.appendChild(headerContainer)
            card.appendChild(deleteContainer)
            cardsContainer.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        cardsContainer.textContent = "Failed to load memberships";
    }
};

document.addEventListener("DOMContentLoaded", (event) => {
    fetchMemberships();
});
const handleDeleteMembership = async (event) => {
    const membershipId = event.currentTarget.getAttribute('data-id');
    const confirmed = confirm("Are you sure you want to delete this membership?");
    if (confirmed) {
        try {
            const response = await fetch(`http://localhost:3000/memberships/${membershipId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                event.target.closest('.membershipCard').remove();
                alert('Membership deleted successfully.');
            } else {
                throw new Error('Failed to delete membership.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting the membership.');
        }
    }
};

