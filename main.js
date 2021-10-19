const apiLink = 'https://jsonplaceholder.typicode.com/users'

const addUserBtn = document.getElementById('btn-addUser')

const usersTableBody = document.getElementById('tableBody')

const addUserModal = document.querySelector('.addUserModal')
const addUserModal_CloseBtn = document.querySelector('.addUserClose')
const addUserModal_SaveBtn = document.querySelector('.saveNewUser')

const inputs = document.querySelectorAll('input')

const fetchedData = getDataFromApi()

// ! Fetch Data by API

function getDataFromApi() {
	return fetch(apiLink)
		.then(res => res.json())
}

fetchedData.then(usersData => console.log(usersData))

// ! Render Fetched Data in Table

let globalUsersData;
initTable();

function initTable() {
	fetchedData.then(usersData => {

		usersData.forEach(userData => {
			userData.isAditable = false;
		});

		globalUsersData = usersData;
		renderTable(usersData);
	})
}

function renderTable(usersData) {

	let tableRow = '';

	globalUsersData.forEach(userData => {
		if (userData.isAditable === true) {
			tableRow += `
			<tr>
				<th id="full-info" scope="row">${userData.id}</th>
				<td id="full-info"> <input type="text" value="${userData.name}"></td>
				<td id="full-info"> <input type="text" value="${userData.email}"></td>
				<td id="full-info"> <input type="text" value="${userData.address.city}">
									<input type="text" value="${userData.address.street}" class="my-1">
									<input type="text" value="${userData.address.suite}">
				</td>
				<td id="full-info"> <input type="text" value="${userData.company.name}"></td>
				<td id="full-info"> <input type="text" value="${userData.address.zipcode}"></td>
				<th scope="row">
					<div class="editDataBtns d-flex">
						<button class="saveUserDataBtn btn-success rounded-3 m-1" style="cursor: pointer">Save</button>
						<button class="cancelEditingBtn btn-secondary rounded-3 m-1" style="cursor: pointer">Cancel</button>
					</div>
				</th>
			</tr>
			`
		} else {
			tableRow += `
			<tr>
				<th id="full-info" scope="row">${userData.id}</th>
				<td id="full-info">${userData.name}</td>
				<td id="full-info">${userData.email}</td>
				<td id="full-info">${userData.address.city},
					${userData.address.street},
					${userData.address.suite}</td>
				<td id="full-info">${userData.company.name}</td>
				<td id="full-info">${userData.address.zipcode}</td>
				<th scope="row">
					<div class="defaultBtns d-flex">
						<button onclick="editUserData(${userData.id})" class="btn-primary rounded-3 m-1" style="cursor: pointer">Edit</button>
						<button onclick="removeUser(${userData.id})" class="btn-danger rounded-3 m-1" style="cursor: pointer">Remove</button>
					</div>
					<div class="editDataBtns d-flex d-none">
						<button class="saveUserDataBtn btn-success rounded-3 m-1" style="cursor: pointer">Save</button>
						<button class="cancelEditingBtn btn-secondary rounded-3 m-1" style="cursor: pointer">Cancel</button>
					</div>
				</th>
			</tr>
			`
		}
	});
	usersTableBody.innerHTML = tableRow;
}

// ! Add User to the Table

addUserBtn.addEventListener('click', showAddUserModal)
addUserModal_CloseBtn.addEventListener('click', closeAddUserModal)
addUserModal_SaveBtn.addEventListener('click', saveNewUser)

function showAddUserModal() {
	addUserModal.style.display = 'block'
}

function closeAddUserModal() {
	addUserModal.style.display = 'none'
	clearInputs()
}

function clearInputs() {
	inputs.forEach(input => input.value = '')
}

function saveNewUser() {
	const id = globalUsersData[globalUsersData.length - 1].id + 1;
	const fullName = document.querySelector('input[placeholder = "Full Name"]').value
	const email = document.querySelector('input[placeholder = "Email"]').value
	const city = document.querySelector('input[placeholder = "City"]').value
	const street = document.querySelector('input[placeholder = "Street"]').value
	const suite = document.querySelector('input[placeholder = "Suite"]').value
	const companyName = document.querySelector('input[placeholder = "Company Name"]').value
	const zipCode = document.querySelector('input[placeholder = "Zipcode"]').value

	const newUser = {
		id: id,
		name: fullName,
		email: email,
		address: {
			city: city,
			street: street,
			suite: suite,
			zipcode: zipCode,
		},
		company: {
			name: companyName,
		},
	}

	globalUsersData.push(newUser)
	renderTable(globalUsersData)
	closeAddUserModal()
}

// ! Table Sorting

const tableThs = document.querySelectorAll('th[scope="col"]');
sortTable();

function sortTable() {
	for (const tableTh of tableThs) {
		tableTh.addEventListener('click', sortColumn);

		function sortColumn() {
			const order = this.dataset.order;
			const column = this.dataset.column;
			const nested = this.dataset.nested;

			if (order == 'desc') {
				this.setAttribute('data-order', 'asc');
				globalUsersData = globalUsersData.sort((a, b) => a[column] > b[column] ? 1 : -1);
				globalUsersData = globalUsersData.sort((a, b) => a[column][nested] > b[column][nested] ? 1 : -1);
			} else {
				this.setAttribute('data-order', 'desc');
				globalUsersData = globalUsersData.sort((a, b) => a[column] < b[column] ? 1 : -1);
				globalUsersData = globalUsersData.sort((a, b) => a[column][nested] < b[column][nested] ? 1 : -1);
			};

			renderTable(globalUsersData);
			console.log('column clicked:', column, order);
			console.log(globalUsersData);
		}
	}
}

// ! Add Column with Action Buttons

function removeUser(userToRemoveId) {
	globalUsersData = globalUsersData.filter(userData => userData.id != userToRemoveId);
	renderTable(globalUsersData);

	console.log('userToRemoveId ' + userToRemoveId + ' : has been removed');
	console.log(globalUsersData);
}

function editUserData(userToEditId) {
	globalUsersData.find(userData => userData.id === userToEditId).isAditable = true;
	renderTable(globalUsersData);

	console.log('userToEditId ' + userToEditId + ': was clicked');
}