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
            anmeldungsItems: [],
            pendingAnmeldungen: [],
            Points: 0,
            chatMessages: [],
        }
    },
    watch: {
        'searchQuerys.activitys': function (val) {
            this.getAllActivities(val);
        },
        'searchQuerys.pending': function (val) {
            this.getPendingActivities(val);
        }
    },
    methods: {
        getMessages(userName, authKey, acitivtyId, recall) {
            let d = {
                "UserName": userName,
                "AuthKey": authKey,
                "AktivitaetID": activityId,
                "_": new Date().getTime()
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/getMessages.php", d));
            xml.send(); 

            xml.onload = function() {
                recall(this.response);
            }

        },
        checkUserPassword(email, userPassword, recall) {
            let d = {
                "Passwort": userPassword,
                "Email": email,
                "_": new Date().getTime()
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
                "_": new Date().getTime()
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
          this.getAllActivities(this.searchQuerys.activitys);
          this.getPendingActivities(this.searchQuerys.pending);
          this.getMessages(this.userData.userName, this.userData.AuthKey, this.selectedActivityId, this.loadMessages);
          this.getPoints();
        },
        loadMessages(data) { 
            let d = JSON.parse(data); 
            if (d["Status"] == "200") {
                this.chatMessages = d["Data"];
            } else {
                console.log("Error: " + d);
            }
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
            this.userData.SchuelerID = this.getCookie("username");
            this.userData.AuthKey = this.getCookie("authKey");
        },
        init() {
            this.loadCookies();
            this.getUserInfos(this.login);
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
          }
    }, 
    created() {
        this.init();
        this.update();
        setInterval(this.update, 1000);
    }
});