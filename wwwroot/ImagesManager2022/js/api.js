//a retirer cest le lien du prof 
//const serverHost = "https://api-server-5.glitch.me";

//lien local
const serverHost = "http://localhost:5000";
const service = "/api/images";
/* Local Storage utilities fonctions */
function tokenRequestURL() {
    return serverHost + '/token';
}
function storeAccessToken(token) {
    sessionStorage.setItem('access_Token', token);
}
function eraseAccessToken() {
    sessionStorage.removeItem('access_Token');
}
function retrieveAccessToken() {
    return sessionStorage.getItem('access_Token');
}
function getBearerAuthorizationToken() {
    return { 'Authorization': 'Bearer ' + retrieveAccessToken() };
}
function registerRequestURL() {
    return serverHost + '/Accounts/register';
}
function storeLoggedUser(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
}
function retrieveLoggedUser() {
    return JSON.parse(sessionStorage.getItem('user'));
}
function deConnect() {
    sessionStorage.removeItem('user');
    eraseAccessToken();
}

/* AJAX functions utlities */
function register(profil, successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + "/accounts/register",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(profil),
        success: function (profil) {
            console.log(profil);
            successCallBack(profil);
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    })
}

function login(Email, Password, successCallBack, errorCallBack) {
    $.ajax({
        url: tokenRequestURL(),
        contentType: 'application/json',
        type: 'POST',
        data: JSON.stringify({ Email, Password }),
        success: function (token) {
            storeAccessToken(token.Access_token);
            getUserInfo(token.UserId, successCallBack, errorCallBack);
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status); }
    })
}
function verifyEmail(userId, verifyCode, successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + `/Accounts/verify?id=${userId}&code=${verifyCode}`,
        type: 'GET',
        contentType: 'text/plain',
        data: {},
        success: function () {
            getUserInfo(userId, successCallBack, error);
            successCallBack();
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    })
}
function getUserInfo(userId, successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + "/Accounts/index" + "/" + userId,
        type: 'GET',
        contentType: 'text/plain',
        data: {},
        success: function (profil) {
            console.log(profil);
            storeLoggedUser(profil);
            successCallBack(profil);
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    })
}
function modifyUserInfo(userInfo, successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + "/Accounts/modify" + "/" + userInfo.Id,
        type: 'PUT',
        contentType: 'application/json',
        headers: getBearerAuthorizationToken(),
        data: JSON.stringify(userInfo),
        success: function () {
            getUserInfo(userInfo.Id, successCallBack, error);
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    })
}
function logout(userId, successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + "/accounts/logout/" + userId,
        type: 'GET',
        data: {},
        headers: getBearerAuthorizationToken(),
        success: () => {
            deConnect();
            successCallBack();
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function unsubscribeAccount(userId, successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + "/accounts/remove/" + userId,
        contentType: 'application/json',
        type: 'GET',
        data: {},
        headers: getBearerAuthorizationToken(),
        success: () => {
            deConnect();
            successCallBack();
        },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}

function HEAD(successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + service,
        type: 'HEAD',
        contentType: 'text/plain',
        complete: request => { successCallBack(request.getResponseHeader('ETag')) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function GET_ID(id, successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + service + "/" + id,
        type: 'GET',
        headers: getBearerAuthorizationToken(),
        success: data => { successCallBack(data); },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function GET_ALL(successCallBack, errorCallBack, queryString = null) {
    let url = serverHost + service + (queryString ? queryString : "");
    $.ajax({
        url: url,
        headers: getBearerAuthorizationToken(),
        type: 'GET',
        success: (data, status, xhr) => { successCallBack(data, xhr.getResponseHeader("ETag")) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function POST(data, successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + service,
        type: 'POST',
        headers: getBearerAuthorizationToken(),
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (data) => { successCallBack(data) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function PUT(data, successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + service + "/" + data.Id,
        type: 'PUT',
        headers: getBearerAuthorizationToken(),
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: () => { successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function DELETE(id, successCallBack, errorCallBack) {
    $.ajax({
        url: serverHost + service + "/" + id,
        type: 'DELETE',
        headers: getBearerAuthorizationToken(),
        success: () => { successCallBack() },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
