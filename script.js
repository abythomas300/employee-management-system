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



let tableBody = document.querySelector("#employeeTableBody")
let rows = "";

// fetch data from API
fetch("http://localhost:3000/employees")       // fetching API
    .then((response)=>{                        // handling http response
        return response.json()                 // converting unreadable response body to .json format
    })
    .then((data)=>{                            // receiving the actual data from the promise return by json() method
        for(let i = 0; i < data.length; i++) {
            rows = rows + `
        <tr>
            <td>${i+1}</td>
            <td>${data[i].firstName}</td>
            <td>${data[i].email}</td>
            <td>${data[i].phone}</td>
            <td>${data[i].gender}</td>
            <td>${data[i].dob}</td>
            <td>${data[i].country}</td>
            
        <tr>
        `
        }
        tableBody.innerHTML = rows;              // assigning all the rows value to table body 
    })

