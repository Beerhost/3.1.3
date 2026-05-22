document.addEventListener('DOMContentLoaded', async () => {
    const user = await fetch('/api/user').then(response => response.json());
    renderCurrentUser(user);
});

function renderCurrentUser(user) {
    const tableBody = document.getElementById('currentUserTableBody');
    tableBody.innerHTML = `
        <tr>
            <td>${user.id}</td>
            <td>${escapeHtml(user.firstName)}</td>
            <td>${escapeHtml(user.lastName)}</td>
            <td>${user.age}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>${formatRoles(user.roles)}</td>
        </tr>
    `;
}

function formatRoles(roles) {
    return roles.map(role => role.name.replace('ROLE_', '')).join(' ');
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
