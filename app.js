var vue = new Vue({
    el: '#app',
    data() {
        return {
            message: "Hallo, hier kriegt ihr euer Mint Zertifikat",
            apiEndpoint: "./API/",
            password: "",
            email: "",
            userData: {},
            loggedIn: "",
            activities: [],
            shitCookies: true,
            loginInformations: {
                email: "",
                password: ""
            },
            verifyInformations: {
                username: "",
                password: ""
            },
            isError: false,
            error: {
                Error: "",
                Message: ""
            },
            userType: -1,

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
                recall(this.response);
            }
        },
        getUserInfos(schuelerId, password, recall) {
            let d = {
                "SchuelerID": schuelerId,
                "AuthKey": password,
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/userInfo.php", d));
            xml.send();
            xml.onload = function() {
                recall(this.response);
            }
        },

        echoParams: function(url, data) {
            var string = url + "?";
            for (key in data) {
                string += key + "=" + data[key] + "&";
            }
            return string;
        },
        checkCookies() {
            this.userData.userName = this.getCookie("username");
            this.userData.authKey = this.getCookie("authKey");
        },

        // Recalls
        login(data) {
            let dataJs = JSON.parse(data);
            console.log(dataJs);
            if (dataJs.Status == "200") {
                this.userData = dataJs;
                this.loggedIn = true;
                this.userType = dataJs.Type;
                if (this.userType == 0) {
                    this.setCookie("username", this.userData.SchuelerID, 30);
                    this.setCookie("authKey", this.userData.AuthKey, 30);
                    window.location.replace("./user/");
                } else {
                    this.setCookie("Kuerzel", this.userData.Kuerzel, 30);
                    this.setCookie("AuthKey", this.userData.AuthKey, 30);
                    window.location.replace("./teacher/");
                }
            } else {
                this.isError = true;
                this.error = dataJs;
            }
        },
        goToVerify(data) {
            console.log(data);
        },

        // Runs
        runLogin() {
            this.checkUserPassword(this.loginInformations.email, this.loginInformations.password, this.login);
        },
        runVerify() {
            this.checkUserNotVerified(this.verifyInformations.username, this.verifyInformations.password, this.goToVerify);
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
        this.checkCookies();
        if (this.userData.userName != "" && this.userData.authKey != "") {
            this.getUserInfos(this.userData.userName, this.userData.authKey, this.login);
        }
    }
});