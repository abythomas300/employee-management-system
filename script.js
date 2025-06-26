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


// - - - - - READ OPERATION - - - - - //

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
        
    <tr>
    `
    }
    tableBody.innerHTML = rows;                                     // assign the 'rows' html code into tableBody
}

getEmployeeData();                                                  // invoke method to fetch data from API
