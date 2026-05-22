const csrfToken = document.querySelector('meta[name="_csrf"]').content;
const csrfHeader = document.querySelector('meta[name="_csrf_header"]').content;

let users = [];
let roles = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadPageData();

    document.getElementById('newUserForm').addEventListener('submit', createUser);
    document.getElementById('editUserForm').addEventListener('submit', updateUser);
    document.getElementById('deleteUserForm').addEventListener('submit', deleteUser);
});

async function loadPageData() {
    const [loadedUsers, loadedRoles] = await Promise.all([
        request('/api/admin/users'),
        request('/api/admin/roles')
    ]);

    users = loadedUsers;
    roles = loadedRoles;

    fillRoleSelects();
    renderUsersTable();
}

async function request(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken,
            ...options.headers
        },
        ...options
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function renderUsersTable() {
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${escapeHtml(user.firstName)}</td>
            <td>${escapeHtml(user.lastName)}</td>
            <td>${user.age}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${formatRoles(user.roles)}</td>
            <td><button type="button" class="btn btn-info" data-action="edit" data-id="${user.id}">Edit</button></td>
            <td><button type="button" class="btn btn-danger" data-action="delete" data-id="${user.id}">Delete</button></td>
        `;
        tableBody.append(row);
    });

    tableBody.querySelectorAll('[data-action="edit"]').forEach(button => {
        button.addEventListener('click', () => openEditModal(Number(button.dataset.id)));
    });

    tableBody.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', () => openDeleteModal(Number(button.dataset.id)));
    });
}

function fillRoleSelects() {
    document.querySelectorAll('.roles-select').forEach(select => {
        select.innerHTML = '';
        roles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.id;
            option.textContent = trimRoleName(role.name);
            select.append(option);
        });
    });
}

function openEditModal(id) {
    const user = findUser(id);
    const form = document.getElementById('editUserForm');
    form.reset();

    document.getElementById('editId').value = user.id;
    document.getElementById('editIdView').value = user.id;
    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editLastName').value = user.lastName;
    document.getElementById('editAge').value = user.age;
    document.getElementById('editEmail').value = user.email;
    selectUserRoles(document.getElementById('editRoles'), user.roles);

    $('#editModal').modal('show');
}

function openDeleteModal(id) {
    const user = findUser(id);

    document.getElementById('deleteId').value = user.id;
    document.getElementById('deleteIdView').value = user.id;
    document.getElementById('deleteFirstName').value = user.firstName;
    document.getElementById('deleteLastName').value = user.lastName;
    document.getElementById('deleteAge').value = user.age;
    document.getElementById('deleteEmail').value = user.email;
    selectUserRoles(document.getElementById('deleteRoles'), user.roles);

    $('#deleteModal').modal('show');
}

async function createUser(event) {
    event.preventDefault();

    await request('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(userFromForm(event.target))
    });

    event.target.reset();
    await reloadUsers();
    $('#users-tab').tab('show');
}

async function updateUser(event) {
    event.preventDefault();

    const id = document.getElementById('editId').value;
    await request(`/api/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userFromForm(event.target))
    });

    $('#editModal').modal('hide');
    await reloadUsers();
}

async function deleteUser(event) {
    event.preventDefault();

    const id = document.getElementById('deleteId').value;
    await request(`/api/admin/users/${id}`, {
        method: 'DELETE'
    });

    $('#deleteModal').modal('hide');
    await reloadUsers();
}

async function reloadUsers() {
    users = await request('/api/admin/users');
    renderUsersTable();
}

function userFromForm(form) {
    const formData = new FormData(form);
    return {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        age: Number(formData.get('age')),
        email: formData.get('email'),
        password: formData.get('password'),
        roles: formData.getAll('roles').map(Number)
    };
}

function selectUserRoles(select, userRoles) {
    const selectedIds = userRoles.map(role => role.id);
    Array.from(select.options).forEach(option => {
        option.selected = selectedIds.includes(Number(option.value));
    });
}

function findUser(id) {
    return users.find(user => user.id === id);
}

function formatRoles(userRoles) {
    return userRoles.map(role => trimRoleName(role.name)).join(' ');
}

function trimRoleName(roleName) {
    return roleName.replace('ROLE_', '');
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
