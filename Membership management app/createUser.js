const membershipInput = document.getElementById("membershipInput")
const createUserButton = document.getElementById("createUserButton")
const fetchMembershipsOptions = async () => {
    try{
        const response = await fetch(`http://localhost:3000/memberships`);
        const membershipData = await response.json();
        membershipData.forEach(membership => {
            const membershipOption = document.createElement("option")
            membershipOption.innerText = membership.name
            membershipOption.value=membership._id
            membershipInput.appendChild(membershipOption)
        });

    } catch (error){
        console.error(error)
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    fetchMembershipsOptions();
});

const postNewUser = async () =>{

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("emailInput").value;
    const selectedMembership = membershipInput.value;

    if (!firstName || !lastName || !email) {
        alert("Please fill in all fields.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const userData = {
        name: firstName,
        surname: lastName,
        email: email,
        service_id: selectedMembership
    };

    try {
        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            document.getElementById("firstName").value = '';
            document.getElementById("lastName").value = '';
            document.getElementById("emailInput").value = '';
            membershipInput.selectedIndex = 0;

            console.log('User created successfully!');
        } else {
            throw new Error('User creation failed');
        }
    } catch (error) {
        console.error("Error creating user: ", error)
    }
}
 
createUserButton.addEventListener('click', postNewUser);