// for making table toggle on button click
let formContainer = document.querySelector("#form-container");
let formToggleButton = document.querySelector("#formToggleBtn");
let isFormVisible = false;
function toggleForm(){
    if(!isFormVisible) {
        formContainer.classList.remove("d-none");
        formContainer.classList.add("d-block");
        formToggleButton.classList.add("custom-btn-border");
        isFormVisible = true;
    } else {
        formContainer.classList.add("d-none");
        formContainer.classList.add("d-block");
        formToggleButton.classList.remove("active");
        formToggleButton.classList.remove("custom-btn-border");
        isFormVisible = false;
    }
}



// for disabling page reload during  button click
let employeeForm = document.querySelector("#employeeForm"); // getting form
employeeForm.addEventListener("submit", (e)=>{
    e.preventDefault()
})



// for fetching all details input by user
function fetchInputDetails() {

    const salutation = document.querySelector("#salutation").value;
    const firstName = document.querySelector("#firstname").value;
    const lastName = document.querySelector("#lastname").value;
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const email = document.querySelector("#email").value;
    const phoneno = document.querySelector("#phoneno").value;
    const gender = document.querySelector("#gender").value;
    const qualification = document.querySelector("#qualification").value;
    const country = document.querySelector("#country").value;
    const dob = document.querySelector("#dob").value;
    const address = document.querySelector("#address").value;
    const city = document.querySelector("#city").value;
    const state = document.querySelector("#state").value;

    // logging out to console for testing purpose
    console.log("User Input data");  
    console.log(salutation);
    console.log(firstName);
    console.log(lastName);
    console.log(username);
    console.log(password);
    console.log(email);
    console.log(phoneno);
    console.log(gender);
    console.log(qualification);
    console.log(country);
    console.log(dob);
    console.log(address);
    console.log(city);
    console.log(state);

}



// - - - - - READ OPERATION - - - - - 

// fetch data from API
async function getEmployeeData() {
    let response = await fetch("http://localhost:3000/employees")            
    const dataArray = await response.json()
    renderTable(dataArray)
}

function renderTable(data) {                                        // receives 'dataArray' value
    let tableBody = document.querySelector("#employeeTableBody")
    let rows = "";

    for(let i = 0; i < data.length; i++) {
        rows = rows + `
    <tr>
        <td>${i+1}</td>
        <td>${data[i].salutation}. ${data[i].firstName}</td>
        <td>${data[i].email}</td>
        <td>${data[i].phone}</td>
        <td>${data[i].gender}</td>
        <td>${data[i].dob}</td>
        <td>${data[i].country}</td>
        <td><button type="button" class="btn btn-sm btn-outline-success">Update</button> <button type="button" class="btn btn-sm btn-outline-danger">Delete</button></td>
    <tr>
    `
    }
    tableBody.innerHTML = rows;                                     // assign the 'rows' html code into tableBody
}

getEmployeeData();                                                  // invoke method to fetch data from API
