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

// for selecting alert box
let alertbox = document.querySelector("#alertbox");

// for disabling page reload during  button click
let employeeForm = document.querySelector("#employeeForm"); // getting form
employeeForm.addEventListener("submit", (e)=>{
    e.preventDefault()
})



// for fetching all details input by user
function fetchInputDetails() {

    const salutation = document.querySelector("#salutation").value.trim();
    const firstName = document.querySelector("#firstname").value.trim();
    const lastName = document.querySelector("#lastname").value.trim();
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phoneno = document.querySelector("#phoneno").value.trim();
    const gender = document.querySelector("#gender").value.trim();
    const qualification = document.querySelector("#qualification").value.trim();
    const country = document.querySelector("#country").value.trim();
    const dob = document.querySelector("#dob").value.trim();
    const address = document.querySelector("#address").value.trim();
    const city = document.querySelector("#city").value.trim();
    const state = document.querySelector("#state").value.trim();

    // logging out to console for testing purpose
    console.log("User Input data:");  
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

    // for converting above data into an object to send for client-side validation
    let inputDetails = {
        salutation,
        firstName,
        lastName, 
        username, 
        password, 
        email, 
        phoneno, 
        gender, 
        qualification, 
        country, 
        dob, 
        address, 
        city, 
        state
    }

    console.log("Object :");
    console.log(inputDetails)

    // for sending above object for client side validation
    validation(inputDetails);  // invoke client side validation method
}


// - - - - - CLIENT SIDE VALIDATION - - - - -

function validation(employee) {      // the parameter 'employee' reveived 'inputDetails' send by fetchInputDetails()

    const errorsLog = [];            // array for storing all error messages when one or more validation fails.
    
    if(!validateEmail(employee.email)) {
        errorsLog.push("Invalid e-mail format");
    }

    if(!validatePhoneno(employee.phoneno)) {
        errorsLog.push("Invalid phone number format");
    }

    if(!validateDate(employee.dob)) {
        errorsLog.push("Invalid date format");
    }

    if(!validatePasswordLength(employee.password)) {
        errorsLog.push("Password is weak");
    }

    // for logging out all found errors 
    if(errorsLog.length > 0) {
        alertbox.classList.remove("d-none");
        console.log("These following errors were found :")
        errorsLog.forEach((err)=>{
            console.error(err);
        })
    } else {
        console.log("Client Side Validation complete ✅ \n No errors found.");
    }

}

// for checking whether entered email has correct format
function validateEmail(email) {  // receives 'employee.email' parameter send from validation() method
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// for checking whether date is in correct format 
function validatePhoneno(phoneNo) {
    const phonenoRegex = /^\d{10}$/;
    return phonenoRegex.test(phoneNo)
} 

// for checking whether date is in correct format
function validateDate(date) {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    return dateRegex.test(date);
}

//for checking whether password has 8 or more characters
function validatePasswordLength(pass) { // the parameter 'pass' receives 'employee.password' parameter send by validation() method
    return pass.length < 8? false: true;
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
