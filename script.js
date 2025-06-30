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
        formToggleButton.classList.remove("active");
        formToggleButton.classList.remove("custom-btn-border");
        isFormVisible = false;
    }
}



// for storing employees id globally
const collectionOfID = []; 



// for storing id of employee to be updated
let idOfEmployeeToBeUpdated = "";


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
    inputDetails.dob = convertDateToDDMMYY(inputDetails.dob)  
    console.log("Date object after format conversion", inputDetails.dob); // for debugging

    // for sending above object for client side validation
    validation(inputDetails);  // invoke client side validation method
}


// helper method to convert date from YYYY-MM-DD to DD-MM-YYYY (this conversion is mandatory to match the validation in the backend)
function convertDateToDDMMYY(normalFormatDate) {
    const splittedDate = normalFormatDate.split("-");
    console.log("Splitted Date array:", splittedDate);
    const formatCorrectedDate = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`
    console.log("Date in correct format", formatCorrectedDate);
    return formatCorrectedDate;
}


function convertDateToYYYYMMDD(normalFormatDate) {
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
async function getEmployeeData(id) {  // This 'id' contains the id of a particular employee who's data is to be updated(sent from updateButtons Event listener)
    if(id === undefined) {  
        let response = await fetch("http://localhost:3000/employees/")            
        const dataArray = await response.json()
        console.log("Finish fetch operation (id===undefined)");

        dataArray.forEach((employee)=>{     // storing every id to collectionOfID[] for storing it globally
            collectionOfID.push(employee.id)  
        });

        renderTable(dataArray)
    } else {    // for fetching data of a particular employee with given id (for UPDATE operation)
        console.log("Started getting specific employee details")
        let response = await fetch(`http://localhost:3000/employees/${id}`)
        console.log("Fetch operation complete - specific employee")  //for debug
        const data = await response.json();
        const specificEmployeeDetails = data;
        console.log(specificEmployeeDetails);
        console.log("Data is of the type", typeof specificEmployeeDetails)  //for debug
        console.log("Returning data to prefillForm()")  //for debug
        prefillForm(specificEmployeeDetails);
    }
}



// for rendering data to the table
function renderTable(data) {                                        // receives 'dataArray' value
    let tableBody = document.querySelector("#employeeTableBody")
    let rows = "";

    // for generating table rows dynamically
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
    
    // Event listener for UPDATE button
    let updateButtons = document.querySelectorAll(".updt-button");
    updateButtons.forEach((updateButton)=>{
        updateButton.addEventListener("click", ()=>{
            let clickedUpdateBtnUUID = updateButton.dataset.uuid;
            console.log("Update Button Click Detected from id: "+clickedUpdateBtnUUID) // for debugging
            getEmployeeData(clickedUpdateBtnUUID);  // sending specific uuid to prefill form with that employee's details
        })
    }) 

    // Event listener for DELETE button
    let deleteButtons = document.querySelectorAll(".dlt-button"); 
    deleteButtons.forEach((deleteButton)=>{
        deleteButton.addEventListener("click", ()=>{
            if(confirm("Are you sure you want to delete?")) {  // confirmation box
                deleteEmployee(deleteButton.dataset.uuid)  // deleteEmployee() method INVOKE
            }
        })
    })
    
}



// for prefilling form with updating employee's initial data
function prefillForm(specificEmployeeDetails) { // this parameter receives 'specificEmployeeDetails' send my getEmployee() 
    
    // making form visible
    console.log("Making form visible")
    formContainer.classList.remove("d-none");

    //making update button visible
    let formUpdateButton = document.querySelector(".form-update-button");
    formUpdateButton.classList.remove("d-none")

    // storing id of the employee to be updated in the global variable 'idOfEmployeeToBeUpdated'
    idOfEmployeeToBeUpdated = specificEmployeeDetails.id;

    //prefilling old data to all respective fields
    const eSalutation = document.querySelector("#salutation")
    const eFirstName = document.querySelector("#firstname")
    const eLastName = document.querySelector("#lastname")
    const eUsername = document.querySelector("#username")
    const ePassword = document.querySelector("#password")
    const eEmail = document.querySelector("#email")
    const ePhone = document.querySelector("#phoneno")
    const eGender = document.querySelector("#gender")
    const eQualifications = document.querySelector("#qualification")
    const eCountry = document.querySelector("#country")
    const eDOB = document.querySelector("#dob")
    const eAddress = document.querySelector("#address")
    const eCity = document.querySelector("#city")
    const eState = document.querySelector("#state")


    console.log(typeof specificEmployeeDetails.firstName)
    eSalutation.value = specificEmployeeDetails.salutation;
    eFirstName.value = specificEmployeeDetails.firstName;
    eLastName.value = specificEmployeeDetails.lastName
    eUsername.value = specificEmployeeDetails.username
    ePassword.value = specificEmployeeDetails.password
    eEmail.value = specificEmployeeDetails.email
    ePhone.value = specificEmployeeDetails.phone
    eGender.value = specificEmployeeDetails.gender
    eQualifications.value = specificEmployeeDetails.qualifications
    eCountry.value = specificEmployeeDetails.country
    eDOB.value = convertDateToYYYYMMDD(specificEmployeeDetails.dob) // converts date back to YYYY-MM-DD and assigns
    eAddress.value = specificEmployeeDetails.address
    eCity.value = specificEmployeeDetails.city
    eState.value = specificEmployeeDetails.state
}



// - - - - - DELETE OPERATION (removing an employee from the list) - - - - -

async function deleteEmployee(id) {  // 'id' receives 'uuid' from renderTable() 
    try {
        console.log("DELETE EMPLOYEE METHOD INVOKED!!") // for debugging
        console.log("Button click detected")
        console.log("Activity found on : ",  id)  

        const res = fetch(`http://localhost:3000/employees/${id}`, {
            method: "DELETE"
        });

        if(!res.ok) {
            throw new Error(`Something wrong with API request. \nResponse Status: ${res.status}`)
        }

    } catch(e) {
        console.log("Error deleting employee", e.message)
    }
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

