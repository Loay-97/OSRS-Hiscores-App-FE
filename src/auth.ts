export function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // alleen als je token gebruikt

    // Refresh & redirect
    window.location.href = "/login";
}
