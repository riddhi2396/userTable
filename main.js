var selectedRow = null;
let users = [];

window.onload = showUserTable();
// search by name
function searchByName() {
  var input, filter, table, tr, td, value;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("table");
  tr = table.getElementsByTagName("tr");

  for (let i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      value = td.textContent || td.innerText;
      if (value.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// open a popup
function openForm() {
  var modal = document.getElementById("myModal");
  var span = document.getElementsByClassName("close")[0];
  modal.style.display = "block";
  if (selectedRow == null) {
    document.getElementById("title").innerHTML = "ADD New User";
  } else {
    document.getElementById("title").innerHTML = "Update User";
  }
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

// Close a popup
function closeForm() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// submit a form
function submitForm() {
  if (selectedRow == null) {
    readFormData();
    showUserTable();
  } else {
    updateUserData();
  }
  closeForm();
  reset();
}

// Reads user inputs
function readFormData() {
  var data = {};
  data["name"] = document.getElementById("name").value;
  data["dob"] = document.getElementById("dob").value;
  data["city"] = document.getElementById("city").value;
  data["interests"] = document.getElementById("interest").value;
  data["age"] = calculateAge(document.getElementById("dob").value);
  users.push(data);
  localStorage.setItem("userTable", JSON.stringify(users));
}

// Calculate age based on birthdate
function calculateAge(date) {
  let split_dob = date.split("/");
  var month = split_dob[0];
  var day = split_dob[1];
  var year = split_dob[2];

  var dob_asdate = new Date(year, month, day);
  var today = new Date();
  var mili_dif = Math.abs(today.getTime() - dob_asdate.getTime());
  var age = mili_dif / (1000 * 3600 * 24 * 365.25);
  within_age_range = (14 < age) & (age < 24);

  return Math.round(age) + " " + "years";
}

// Add new user to table
function showUserTable() {
  getData();
  var table = document.getElementById("table");

  let x = table.rows.length;
  while (--x) {
    table.deleteRow(x);
  }
  for (let i = 0; i < users.length; i++) {
    var row = table.insertRow();
    var cell1 = row.insertCell();
    cell1.innerHTML = users[i].name;

    var cell2 = row.insertCell();
    cell2.innerHTML = users[i].dob;

    var cell3 = row.insertCell();
    cell3.innerHTML = users[i].age;

    var cell4 = row.insertCell();
    cell4.innerHTML = users[i].interests;

    var cell5 = row.insertCell();
    cell5.innerHTML = users[i].city;
    cell5 = row.insertCell();
    cell5.innerHTML = `<a onClick='deleteUser(this)'>Delete</a>
                       <a onClick="editUser(this); openForm(); ">Edit<a/>`;
  }
}

// Reset entire form
function reset() {
  document.getElementById("name").value = "";
  document.getElementById("dob").value = "";
  document.getElementById("city").value = "";
  document.getElementById("interest").value = "";
  selectedRow = null;
}

// open a form with edited user info
function editUser(td) {
  selectedRow = td.parentElement.parentElement;
  console.log(selectedRow.rowIndex);
  document.getElementById("name").value = selectedRow.cells[0].innerHTML;
  document.getElementById("dob").value = selectedRow.cells[1].innerHTML;
  document.getElementById("city").value = selectedRow.cells[2].innerHTML;
  document.getElementById("interest").value = selectedRow.cells[3].innerHTML;
}

// Show updated record to table
function updateUserData() {
  let obj = {};
  obj["name"] = document.getElementById("name").value;
  obj["dob"] = document.getElementById("dob").value;
  obj["city"] = document.getElementById("city").value;
  obj["interests"] = document.getElementById("interest").value;
  obj["age"] = calculateAge(document.getElementById("dob").value);

  id = selectedRow.rowIndex;
  let temp = users;
  temp.splice(id - 1, 1, obj);
  localStorage.setItem("userTable", JSON.stringify(temp));
  showUserTable();
}

// Delete selected user from table
function deleteUser(td) {
  if (confirm("Are you sure to delete this user?")) {
    row = td.parentElement.parentElement;
    reset();
    deleteFromStorage(row.rowIndex);
  }
}

// delete from storage
function deleteFromStorage(id) {
  let temp = users;
  temp.splice(id - 1, 1);
  localStorage.setItem("userTable", JSON.stringify(temp));
  showUserTable();
}

// get data from localstorage
function getData() {
  let str = localStorage.getItem("userTable");
  if (str != null) {
    users = JSON.parse(str);
  }
}
