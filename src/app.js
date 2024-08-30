var vue = new Vue({
    el: '#app',
    data() {
        return {
            message: "Hallo, hier kriegt ihr euer Mint Zertifikat",
            apiEndpoint: "./API/",
            loginInformations: {
                username: "",
                kuerzel: "",
                password: ""
            },
            isError: false,
            error: {
                Error: "",
                Message: ""
            }
        }
    },
    methods: {
        checkStudentPassword: function(username, password, recall){
            let data = {
                "Password": password,
                "Username": username,
                "setAuthKey": true
            }
            
            let xml = new XMLHttpRequest();
            xml.open("POST", this.apiEndpoint + "get/studentLoginPassword.php");
            xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            jsonData = JSON.stringify(data);
            xml.send(jsonData);
        
            xml.onload = function() {
                recall(this.response);
            }
        },
        checkTeacherPassword: function(kuerzel, password, recall) {
            let data = {
                "Password": password,
                "Kuerzel": kuerzel,
                "setAuthKey": true
            }
            
            let xml = new XMLHttpRequest();
            xml.open("POST", this.apiEndpoint + "get/teacherLoginPassword.php");
            xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            jsonData = JSON.stringify(data);
            xml.send(jsonData);
        
            xml.onload = function() {
                recall(this.response);
            }
        },

        // Recalls
        login(data) {
            let dataJs = JSON.parse(data);
            if (dataJs.Status == "200") {
                this.setCookie("AuthKey", dataJs.AuthKey);
                if (dataJs.Type == 0) {
                    this.setCookie("SID", dataJs.SID);
                    window.location.replace("./user/");
                } else {
                    this.setCookie("Kuerzel", dataJs.Kuerzel);
                    window.location.replace("./teacher/");
                }
            } else {
                this.isError = true;
                this.error = dataJs;
            }
        },

        // Runs
        runLoginStudent() {
            this.checkStudentPassword(this.loginInformations.username, this.loginInformations.password, this.login);
        },
        runLoginTeacher() {
            this.checkTeacherPassword(this.loginInformations.kuerzel, this.loginInformations.password, this.login);
        },

        setCookie: function(name, value){
            document.cookie = name + "=" + value + "; path=/";
        }
    }, 
    created() {
    }
});