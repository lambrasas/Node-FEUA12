const usersContainer = document.getElementsByClassName("usersContainer")[0]
const dropDown = document.getElementById("sortDropdown")

const fetchUsers = async () => {
    try {
        const sortValue = dropDown.value
        const response = await fetch(`http://localhost:3000/usersMembership/${dropDown.value}`);
        console.log(response)
        let users = await response.json();
        usersContainer.innerHTML = '';
        
        users.forEach(user => {
            const userCard = document.createElement("div")
            userCard.setAttribute("class", "userCard")
            const userCardInside =document.createElement("div")
            userCardInside.setAttribute("class", "userCardInside")
            const name = document.createElement("b")
            name.setAttribute("class" ,"userName")
            name.textContent = user.name +" "+ user.surname

            const emailLine = document.createElement("p")
            emailLine.setAttribute("class" , "emailLine")
            const userEmail = document.createElement("b")
            emailLine.textContent = "Email Address: "
            userEmail.textContent = user.email

            const memebershipLine = document.createElement("p")
            memebershipLine.textContent = "Membership: "
            const userMembership = document.createElement("b")

            if (user.membership && user.membership.name) {
                userMembership.textContent = user.membership.name;
            } else {
                userMembership.textContent = "Removed";
            }

            const ipLine = document.createElement("p")
            ipLine.textContent = "Ip: "
            const userIp = document.createElement("b")
            userIp.textContent = user.ip

            userCardInside.appendChild(name)

            emailLine.appendChild(userEmail)
            userCardInside.appendChild(emailLine)

            memebershipLine.appendChild(userMembership)
            userCardInside.appendChild(memebershipLine)

            ipLine.appendChild(userIp)
            userCardInside.appendChild(ipLine)
            userCard.appendChild(userCardInside)
            usersContainer.appendChild(userCard)
        });
    } catch (error) {
        console.error(error);
        usersContainer.textContent = "Failed to load users";
    }
};

document.addEventListener("DOMContentLoaded", (event) => {
    fetchUsers();
});

dropDown.addEventListener("change", (event)=>{
    fetchUsers();
})

