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
        // calls the scripts that checks the login credentials of a student and passes the result to the recall function
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
        // calls the scripts that checks the login credentials of a teacher and passes the result to the recall function
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

        // recall of the run functions
        // parses the returned json data and checks wheter the operation was a success
        // then sets login information as a cookie for later use
        // in the end moves current open page into the correct subfolder
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

        // function that can be run from a button in HTML
        // initializes run of the login procedure for students
        runLoginStudent() {
            this.checkStudentPassword(this.loginInformations.username, this.loginInformations.password, this.login);
        },
        // function that can be run from a button in HTML
        // initializes run of the login procedure for teachers
        runLoginTeacher() {
            this.checkTeacherPassword(this.loginInformations.kuerzel, this.loginInformations.password, this.login);
        },

        // creates a cookie with the specified name and value or 
        // overwrites the cookie with the specified name with the new value
        setCookie: function(name, value){
            document.cookie = name + "=" + value + "; path=/";
        }
    }, 
    //function that is called upon changing into this folder
    created() {
    }
});