var vue = new Vue({
    el: '#app',
    data() {
        return {
            message: "Hallo, hier kriegt ihr euer Mint Zertifikat",
            apiEndpoint: "../API/",
            password: "",
            email: "",
            userData: {},
            loggedIn: "",
            activities: [],
            shitCookies: true,
            loginInformations: {
                email: "",
                password: "",
            },
            verifyInformations: {
                
            },
            userLoggedIn: false,
            isError: false,
            error: {
                Error: "",
                Message: ""
            }
        }
    },
    methods: {
        checkUserPassword: function(email, userPassword, recall) {
            let d = {
                "Passwort": userPassword,
                "Email": email
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/userLoginPassword.php", d));
            xml.send();

            xml.onload = function() {
                recall(this.response);
            }
        },
        checkActivitiesUser: function(userId, userAuth, recall) {
            let d = {
                "SchuelerID": userId, 
                "AuthKey": userAuth,
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/userActivites.php", d));
            xml.send();

            xml.onload = function() {
                recall(this.response);
            }
        },
        checkUserNotVerified: function(username, password, recall) {
            let d = {
                "UserName": username,
                "LoginPassword": password 
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "action/checkUserLogin.php", d));
            xml.send();

            xml.onload = function() {
                recall(JSON.parse(this.response), username, password);
            }
        },
        verifyUser: function(userName, loginPassword, email, passwordNew, recall) {
            let d = {
                "Username": userName, 
                "LoginPassword": loginPassword,
                "Email": email,
                "Passwort": passwordNew
            }
            alert("VERIFY");
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "action/verifyUser.php", d));
            xml.send();

            xml.onload = function () {
                recall(JSON.parse(this.response));
            }
        },
        echoParams: function(url, data) {
            var string = url + "?";
            for (key in data) {
                string += key + "=" + data[key] + "&";
            }
            string += "_=" + new Date().getTime();
            return string;
        },
        login(data) {
            this.userData = JSON.parse(data);
        },
        loginUser() {
            this.checkUserPassword(this.loginInformations.email, this.loginInformations.password, this.login);
        },
        runVerify() {
            this.verifyUser(this.verifyInformations.oneTimeUsername, this.verifyInformations.oneTimePassword, this.verifyInformations.email, this.verifyInformations.password, this.verifyUserCallback);
        },
        verifyUserCallback(data) {
            console.table(data);
            if (data.Code == 200) {
                this.userData = JSON.parse(data.Message)
                this.userLoggedIn = true;
                this.setCookie("username", this.userData.SchuelerID, 30);
                this.setCookie("authKey", this.userData.AuthKey, 30);
                window.location.replace("../user/");
            }
        },
        verifiedUser(data, username, userpassword) {
            if (data.Code == 200) {
                this.userLoggedIn = true;
                this.verifyInformations.oneTimeUsername = username;
                this.verifyInformations.oneTimePassword = userpassword;
            } else {
                this.userLoggedIn = false;
                this.isError = true;
                this.error = data;
            }
        },
        testVerify() {
            this.checkUserNotVerified(this.verifyInformations.username, this.verifyInformations.password, this.verifiedUser);
        },
        verifyEmail(email) {
            var string = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            return string.test(email);
        },
        checkParams() {
            var params = new URLSearchParams(window.location.search); 
            if (params.has("username") && params.has("password")) {
                let username = params.get("username");
                let password = params.get("password");
                this.checkUserNotVerified(username, password, this.verifiedUser);
            }
        },

        /* Help Functions */
        getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
          },
          setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
          }
    },
    created() {
        this.checkParams();
    }
});