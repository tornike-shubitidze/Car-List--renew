const API_URL = "http://localhost:3000/cars";
let formIsOpen = false;

(function () {
    printCarsTable();
})();

function printCarsTable() {
    let http = new XMLHttpRequest();
    http.open('GET', API_URL);
    http.onload = () => {
        let carsData = JSON.parse(http.responseText);
        let tbodyData = '';
        carsData.forEach(car => {
            tbodyData += `<tr>
                 <td>${car.name}</td>
                 <td>${car.description}</td>
                 <td>
                 <img src="${car.logo}" style="width:50px;heigth=50px" onerror="this.src='https://www.pikpng.com/pngl/m/16-169566_fail-png-camera-icon-clipart.png'">
                 </td>
                 <td>${car.specifications}</td> 
                 <td>
                 <button class="edit-btn" type="button" data-car-id='${car.id}' onclick="editCar(this)" > Edit </button> 
                 <button class="delete-btn" onclick="deleteCar(this)" data-car-id='${car.id}' type="button"> Delete </button>
                 </td>
            </tr>`;
        });
        document.querySelector('.table-body').innerHTML = tbodyData;
    }
    http.onerror = () => {
        return alert("UPS!❌ Cars Data Not Found😬 First, Please Load Data!")
    }
    http.send();
}


function save() {
    let selectEl = document.getElementById("list");
    let descriptionElement = document.querySelector('#description');
    let logoElement = document.getElementById('logo');

    if (selectEl.value == '' || descriptionElement.value.replace(/\s+/g, '').length == 0 || logoElement.value.replace(/\s+/g, '').length == 0) {
        return alert('All Field Must Be Filled!')
    }

    let selectedSpecifications = Array.from(document.querySelectorAll('.specifications'))
        .filter(specification => {
            return specification.checked;
        }).map(x => x.value);

    let carId = document.querySelector('.indicator').value;

    // if (carId == "" || carId == null) {
    let isUpdate = carId !== "";
    let save = new XMLHttpRequest();
    save.open(isUpdate ? 'PUT' : 'POST', isUpdate ? (API_URL + '/' + `${carId}`) : API_URL);
    save.setRequestHeader("Content-type", "application/json");

    save.onload = () => {
        hideForm();
        document.querySelector('.table-body').innerHTML = '';
        printCarsTable();
    }

    save.onerror = () => { return alert(`Car ${!isUpdate ? 'Not Added!' : 'Update Went wrong!'} Try Again🙂`) };

    save.send(JSON.stringify({
        name: `${selectEl.options[selectEl.selectedIndex].text}`,
        description: `${descriptionElement.value}`,
        logo: `${logoElement.value}`,
        specifications: `${selectedSpecifications}`
    }));
}


function deleteCar(e) {
    if (!confirm("ნამდვილად გსურთ წაშლა?")) {
        return;
    }

    let carId = e.getAttribute('data-car-id');
    let http = new XMLHttpRequest();
    http.open("DELETE", API_URL + '/' + carId);
    http.send();

    http.onerror = () => { return alert('Can Not Delete, Try Again') };

    http.onload = () => {
        document.querySelector('.table-body').innerHTML = '';
        printCarsTable();
    }
}


function editCar(e) {
    if (!formIsOpen) {
        showForm()
    }

    let carId = e.getAttribute('data-car-id');
    let edit = new XMLHttpRequest();
    edit.open('GET', API_URL + '?id=' + carId);
    edit.onload = () => {
        let editCar = JSON.parse(edit.responseText);

        let specs = editCar[0].specifications.split(",");
        document.querySelectorAll('.specifications').forEach(specification => {
            specification.checked = false;
            if (specs.some(spec => spec == specification.value)) {
                specification.checked = true;
            }
        });

        document.querySelector('.indicator').value = carId;
        document.getElementById('list').value = editCar[0].name;
        document.getElementById('description').value = editCar[0].description;
        document.getElementById("logo").value = editCar[0].logo;
    }
    edit.onerror = () => { return alert(`Car cann't Update! Try Again`) }
    edit.send();
}


function showForm() {
    let formEl = document.querySelector('.form');
    formEl.classList.remove("hide");
    formEl.style.display = "block";
    formIsOpen = true;

    // SHOW/HIDE TOGETHER
    // if (formEl.classList.contains("hide")) {
    //     formEl.classList.remove("hide");
    //     formEl.style.display = "block";
    //     formIsOpen = true;
    // } else {
    //     formEl.classList.add("hide");
    //     formEl.style.display = "none";
    //     clearForm();
    //     formIsOpen = false;
    // }
}

function hideForm() {
    let formEl = document.querySelector('.form');
    formEl.classList.add("hide");
    formEl.style.display = "none";
    clearForm();
    formIsOpen = false;
}

function clearForm() {
    document.querySelector('.indicator').value = '';
    document.querySelector('#list').value = '';
    document.querySelector('#description').value = '';
    document.getElementById('logo').value = '';
    Array.from(document.querySelectorAll('.specifications:checked')).forEach(spec => spec.checked = false);
}