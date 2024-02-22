const nameInput = document.getElementById("name")
const priceInput = document.getElementById("price")
const descriptionInput = document.getElementById("description")
const postButton = document.getElementById("createMembershipButton")

const postMembership = async (name, price, description) => {
    
    const body = {
      name: name,
      price: parseInt(price),
      description: description
    };
    console.log(body)
    try {
      const response = await fetch(
        "http://localhost:3000/memberships",
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        const errorBody = await response.text(); 
        throw new Error(`HTTP error! status: ${response.status}. Error: ${errorBody}`);
      }
      const membership = await response.json();

    } catch (error) {
      console.error(error);
      alert('Failed to create membership. Please try again.');
    }
};

postButton.addEventListener("click", (event) =>{
    if(!nameInput.value || !priceInput.value || !descriptionInput.value){
        alert("Please fill in all fields")
        return
    }
    postMembership(nameInput.value, priceInput.value, descriptionInput.value)
    nameInput.value=""
    priceInput.value=""
    descriptionInput.value="" 
});

document.getElementById('cancelButton').addEventListener('click', function(event) {
  event.preventDefault();

  document.querySelectorAll('.createMembershipContainer input').forEach(input => {
    input.value = '';
  });

  document.querySelectorAll('.createMembershipContainer textarea').forEach(textarea => {
    textarea.value = '';
  });
});
