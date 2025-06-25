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