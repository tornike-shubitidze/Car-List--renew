const API_URL = "http://localhost:3000/cars";
let formIsOpen = false;

(function () {
    printCarsTable();
})();

function printCarsTable() {
    let tBodyEl = document.querySelector('.table-body');
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
                 <img src="${car.logo}" style="width:50px;heigth=50px">
                 </td>
                 <td>${car.specifications}</td> 
                 <td>
                 <button class="edit-btn" type="button" data-car-id='${car.id}' onclick="editCar(this)" > Edit </button> 
                 <button class="delete-btn" onclick="deleteCar(this)" data-car-id='${car.id}' type="button"> Delete </button>
                 </td>
            </tr>`;
        });
        tBodyEl.innerHTML = tbodyData;
    }
    http.onerror = () => {
        return alert("UPS! Cars Data Not Found😬 First, Please Load Data!")
    }
    http.send();
}


function save() {
    let selectEl = document.getElementById("list");

    if (selectEl.value == '' || document.querySelector('#description').value == '' || document.getElementById('logo').value == '') {
        return alert('All Field Must Be Filled!')
    }

    let selectedSpecifications = Array.from(document.querySelectorAll('.specifications'))
        .filter(specification => {
            return specification.checked;
        }).map(x => x.value);

    let carId = document.querySelector('.indicator').value;

    if (carId == "" || carId == null) {
        let save = new XMLHttpRequest();
        save.open('POST', API_URL);
        save.setRequestHeader("Content-type", "application/json");

        save.send(JSON.stringify({
            name: `${selectEl.options[selectEl.selectedIndex].text}`,
            description: `${document.getElementById('description').value}`,
            logo: `${document.getElementById("logo").value}`,
            specifications: `${selectedSpecifications}`
        }));

        save.onerror = () => { return alert('Car Not Added! Try Again🙂') };

        save.onload = () => {
            showHideForm();
            clearForm();
            document.querySelector('.table-body').innerHTML = '';
            printCarsTable();
        }
    } else if (carId !== "") {
        let edit = new XMLHttpRequest();
        edit.open('PUT', API_URL + '/' + `${carId}`);
        edit.setRequestHeader("Content-type", "application/json");

        edit.send(JSON.stringify({
            name: `${selectEl.options[selectEl.selectedIndex].text}`,
            description: `${document.getElementById('description').value}`,
            logo: `${document.getElementById("logo").value}`,
            specifications: `${selectedSpecifications}`
        }));

        edit.onerror = () => { return alert('Car Update Went wrong! Try Again🙂') };

        edit.onload = () => {
            showHideForm();
            document.querySelector('.table-body').innerHTML = '';
            printCarsTable();
            clearForm();
        }
    }
}


function deleteCar(e) {
    if (confirm("ნამდვილად გსურთ წაშლა?")) {
        let carId = e.getAttribute('data-car-id');
        let Delete = new XMLHttpRequest();
        Delete.open("DELETE", API_URL + '/' + carId);
        Delete.send();

        Delete.onerror = () => { return alert('Can Not Delete, Try Again') };

        document.querySelector('.table-body').innerHTML = '';
        printCarsTable();
    } else return
}


function editCar(e) {
    if (!formIsOpen) {
        showHideForm()
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
    edit.send();

    edit.onerror = () => { return alert(`Car cann't Update! Try Again`) }
}


function showHideForm() {
    let formEl = document.querySelector('.form');

    if (formEl.classList.contains("hide")) {
        formEl.classList.remove("hide");
        formEl.style.display = "block";
        formIsOpen = true;
    } else {
        formEl.classList.add("hide");
        formEl.style.display = "none";
        clearForm();
        formIsOpen = false;
    }
}

function clearForm() {
    document.querySelector('.indicator').value = '';
    document.querySelector('#list').value = '';
    document.querySelector('#description').value = '';
    document.getElementById('logo').value = '';
    Array.from(document.querySelectorAll('.specifications:checked')).forEach(spec => spec.checked = false);
}