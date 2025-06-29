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
    const phone = document.querySelector("#phoneno").value.trim();
    const gender = document.querySelector("#gender").value.trim();
    const qualifications = document.querySelector("#qualification").value.trim();
    const country = document.querySelector("#country").value.trim();
    const dob = document.querySelector("#dob").value.trim();  // currently in ISO 8601 YYYY-MM-DD Format
    const address = document.querySelector("#address").value.trim();
    const city = document.querySelector("#city").value.trim();
    const state = document.querySelector("#state").value.trim();



    // for converting above data into an object to send for client-side validation
    let inputDetails = {
        salutation,
        firstName,
        lastName, 
        username, 
        password, 
        email, 
        phone, 
        gender, 
        qualifications,
        dob,
        country,  
        address, 
        city, 
        state
    }

    console.log("Object :"); // for debugging
    console.log(inputDetails) // for debugging

    console.log("Date object before format conversion", inputDetails.dob); // for debugging
    console.log("Starting date format conversion . . ."); // for debugging
    inputDetails.dob = convertDateFormat(inputDetails.dob)  
    console.log("Date object after format conversion", inputDetails.dob); // for debugging

    // for sending above object for client side validation
    validation(inputDetails);  // invoke client side validation method
}


// helper method to convert date from YYYY-MM-DD to DD-MM-YYYY (this conversion is mandatory to match the validation in the backend)
function convertDateFormat(normalFormatDate) {
    const splittedDate = normalFormatDate.split("-");
    console.log("Splitted Date array:", splittedDate);
    const formatCorrectedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`
    console.log("Date in correct format", formatCorrectedDate);
    return formatCorrectedDate;
}



// - - - - - CLIENT SIDE VALIDATION - - - - -

function validation(employee) {      // the parameter 'employee' reveived 'inputDetails' send by fetchInputDetails()

    const errorsLog = [];            // array for storing all error messages when one or more validation fails.
    
    if(!validateEmail(employee.email)) {
        errorsLog.push("Invalid e-mail format");
    }

    if(!validatePhoneno(employee.phone)) {
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
        console.log("Passing object to fetch() method for POST operation . . .");
        addEmployee(employee);
    }

}



// for checking whether entered email has correct format
function validateEmail(email) {  // receives 'employee.email' parameter send from validation() method
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// for checking whether date is in correct format 
function validatePhoneno(phone) {
    const phonenoRegex = /^\d{10}$/;
    return phonenoRegex.test(phone)
} 

// for checking whether date is in correct format
function validateDate(date) {
    const dateRegex = /^(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}$/;
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



// for rendering data to the table
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
        <td><button type="button" class="btn btn-sm btn-outline-success updt-button" data-uuid="${data[i].id}">Update</button> 
        <button type="button" class="btn btn-sm btn-outline-danger dlt-button" data-uuid="${data[i].id}">Delete</button></td>
    <tr>
    `
    }
    tableBody.innerHTML = rows;                                     // assign the 'rows' html code into tableBody 
    
}



// - - - - - POST OPERATION (Adding a new employee) - - - - -
async function addEmployee(employee) {  // the 'employee' parameter receives 'employee' argument from the completion of validate() method
    
    try {
        const employeeWithId = {            
            id: crypto.randomUUID(),    //adding UUID to the employee before sending
            ...employee                 // using ... opearator to add the id to the existing object
        }

        console.log("Employee details:");
        console.log(employeeWithId);
        console.log("Employee Details object converted into JSON String:");
        console.log(JSON.stringify(employeeWithId));

        const res = await fetch("http://localhost:3000/employees", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employeeWithId)
        });
        getEmployeeData();  // to update the table with newly added data

        if(!res.ok) {
            throw new Error("Something wrong with the fetch response, failed to add employee!")
        }
    }
    catch(error) {
        console.log("ERROR FOUND AT addEmployee method:", error.message);
    }
} 



getEmployeeData();  // invoking method to fetch data from API

