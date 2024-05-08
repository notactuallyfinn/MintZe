var vue = new Vue({
    el: '#app',
    data() {
        return {
            message: "Hallo, hier kriegt ihr euer Mint Zertifikat",
            apiEndpoint: "../API/",
            password: "",
            email: "",
            userData: {

            },
            loggedIn: "",
            activities: [],
            shitCookies: true,
            loginInformations: {
                email: "",
                password: "",
            },
            searchQuerys: {
                activitys: "",
                pending: ""
            },
            pendingAnmeldungen: [],
        }
    },
    watch: {

    },
    methods: {
        checkUserPassword(email, userPassword, recall) {
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
        checkActivitiesUser(userId, userAuth, recall) {
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
        getUserInfos(recall) {
            let d = {
                "SchuelerID": this.userData.SchuelerID,
                "AuthKey": this.userData.AuthKey,
                "_": new Date().getTime(),
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/userInfo.php", d));
            xml.send();
            xml.onload = function() {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    recall(data);
                } else {
                    window.location.replace("../");
                }
            }
        },
        getTeacherInfos(recall) {
            let d = {
                "Kuerzel": this.userData.Kuerzel,
                "AuthKey": this.userData.AuthKey,
                "_": new Date().getTime(),
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/teacherInfo.php", d));
            xml.send();
            xml.onload = function() {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    recall(data);
                } else {
                    window.location.replace("../");
                }
            }
        },
        getAllActivities(query) {
            let self = this;
            let d = {
                "Query": query,
                "_": new Date().getTime()
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/allActivities.php", d));
            xml.send();
            xml.onload = function() {
                let data = JSON.parse(this.response);
                self.anmeldungsItems = data.Items;
            }
        },
        getPendingActivities(query) {
            let self = this; 
            let d = {
                "UserName": this.userData.SchuelerID,
                "AuthKey": this.userData.AuthKey,
                "Query": query,
                "_": new Date().getTime()
            }
            let xml = new XMLHttpRequest(); 
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/pendingActivities.php", d));
            xml.send();
            xml.onload = function() {
                let data = JSON.parse(this.response); 
                self.pendingAnmeldungen = data.Items;
            }
        },
        getPendingRequests(){
            let self = this; 
            let d = {
                "Kuerzel": this.userData.Kuerzel,
                "AuthKey": this.userData.AuthKey,
                "_": new Date().getTime()
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/teacherActivityRequests.php", d));
            xml.send();
            
            xml.onload = function() {
                let data = JSON.parse(this.response);
                self.pendingAnmeldungen = data.Items;
            }

        },
        registerForActivity(activityId) {
            let self = this;
            let d = {
                "SchuelerID": this.userData.SchuelerID,
                "AuthKey": this.userData.AuthKey,
                "ActivityId": activityId,
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "action/registerForActivity.php", d));
            xml.send();

            xml.onload = function() {
                self.getPendingActivities("");
                console.log(this.response);
                
            }
        },
        getPoints() {
            let self = this; 
            let d = {
                "UserName": this.userData.SchuelerID,
                "_": new Date().getTime()
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/pointsFromUser.php", d));
            xml.send();
            xml.onload = function() {
                self.Points = JSON.parse(this.response).Punkte;
            }
        },
        update() {
          this.getPendingRequests(this.searchQuerys.pending);
        },
        echoParams(url, data) {
            var string = url + "?";
            for (key in data) {
                string += key + "=" + data[key] + "&";
            }
            return string;
        },
        login(data) {
            this.loggedIn = true;
            this.userData = data;
        },
        loadCookies() {
            this.userData.Kuerzel = this.getCookie("Kuerzel");
            this.userData.AuthKey = this.getCookie("AuthKey");
        },
        init() {
            this.loadCookies();
            this.getTeacherInfos(this.login);
        },

        /* Hilfsfunktionen */
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
          },

          react(requestId, value) {
            let self = this;
            let d = {
                "Kuerzel": this.userData.Kuerzel,
                "AuthKey": this.userData.AuthKey,
                "RequestId": requestId,
                "Value": value,
                "_": new Date().getTime()
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "action/reactRequest.php", d));
            xml.send();
            xml.onload = function() {
                self.getPendingRequests(self.searchQuerys.pending);
            }
          },
    }, 
    created() {
        this.init();
        this.update();
        setInterval(this.update, 1000);
    }
});