var vue = new Vue({
    el: '#app',
    data() {
        return {
            message: "Hallo, hier kriegt ihr euer Mint Zertifikat",
            apiEndpoint: "../../API/",
            SID: -1,
            AuthKey: "",
            userData: {},
            loggedIn: "",
            activities: [],
            chosenAID: "",
            gradesOfActivity: [],
            chosenGrade: "",
            gradeLevels: [],
            chosenGradeLevel: "",
            possibleTeachers: [],
            chosenTeacher: "",
            title: "",
            searchQueries: {
                allActivities: "",
                gradesOfActivity: "",
                gradeLevels: "",
                possibleTeachers: "",
                setTitle: ""
            }
        }
    },
    watch: {
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.allActivities': function (val) {
            this.getAllActivities(val);
        },
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.gradesOfActivity': function (val) {
            this.getGradesOfActivity(val);
        },
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.gradeLevels': function (val) {
            this.getGradeLevels(val);
        },
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.possibleTeachers': function (val) {
            this.getPossibleTeachers(val);
        },
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.setTitle': function (val) {
            this.title = val;
        }
    },
    methods: {
        // calls the script that gets the user data from the data base
        getUserInfos: function (recall) {
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey
            };
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/studentData.php", data));
            xml.send();
            xml.onload = function () {
                console.log(this.response);
                let res = JSON.parse(this.response);
                if (res.Status == "200") {
                    recall(res);
                } else {
                    window.location.replace("../");
                }
            }
        },
        // calls the script that gets all possible activities to be chosen from from the data base
        getAllActivities: function (filter) {
            let self = this;
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey,
                "filter": filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/possibleActivities.php", data));
            xml.send();
            xml.onload = function () {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.activities = data.Items;
                } else {
                    window.location.replace("../../");
                }
            }
        },
        // calls the script that gets the possible grades of achievement from the data base
        getGradesOfActivity: function (filter) {
            if (this.chosenAID != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "AuthKey": this.AuthKey,
                    "AID": this.chosenAID,
                    "filter": filter
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "get/gradesOfActivity.php", data));
                xml.send();
                xml.onload = function () {
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.gradesOfActivity = data.Items;
                    } else {
                        window.location.replace("../../");
                    }
                }
            }
        },
        // calls the script that gets the possible grade levels the class can be taken at from the data base
        getGradeLevels: function (filter) {
            if (this.chosenAID != "" && this.chosenGrade != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "AuthKey": this.AuthKey,
                    "filter": filter
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "get/gradeLevels.php", data));
                xml.send();
                xml.onload = function () {
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.gradeLevels = data.Items;
                    } else {
                        window.location.replace("../../");
                    }
                }
            }
        },
        // calls the script that gets the possible teachers that can confirm the users participation from the data base
        getPossibleTeachers: function (filter) {
            if (this.chosenAID != "" && this.chosenGrade != "" && this.chosenGradeLevel != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "AuthKey": this.AuthKey,
                    "class": "",
                    "filter": filter
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "get/possibleTeachers.php", data));
                xml.send();
                xml.onload = function () {
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.possibleTeachers = data.Items;
                    } else {
                        window.location.replace("../../");
                    }
                }
            }
        },

        // function that can be run from a button in HTML
        // sets the chosen activity and calls other required functions
        chooseActivity(AID, Name) {
            this.chosenAID = AID;
            this.getAllActivities(Name);
            this.chosenGrade = "";
            this.chosenGradeLevel = "";
            this.chosenTeacher = "";
            this.getGradesOfActivity("");
        },
        // function that can be run from a button in HTML
        // sets the chosen grade of achievement and calls other required functions
        chooseGradeOfActivity(ALID, Bezeichnung) {
            this.chosenGrade = ALID;
            this.getGradesOfActivity(Bezeichnung);
            this.chosenGradeLevel = "";
            this.chosenTeacher = "";
            this.getGradeLevels("");
        },
        // function that can be run from a button in HTML
        // sets the chosen grade level and calls other required functions
        chooseGradeLevel(gradeLevel) {
            this.chosenGradeLevel = gradeLevel;
            this.getGradeLevels(gradeLevel);
            this.chosenTeacher = "";
            this.getPossibleTeachers("");
        },
        // function that can be run from a button in HTML
        // sets the chosen teacher and calls other required functions
        chooseTeacher(Kuerzel) {
            this.chosenTeacher = Kuerzel;
            this.getPossibleTeachers(Kuerzel);
        },
        // function that can be run from a button in HTML
        // calls the script that creates the pending request of the student for participating in the activity
        createPendingActivity(){
            if (this.chosenAID != "" && this.chosenGrade != "" && this.chosenGradeLevel != "" && this.chosenTeacher != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "Kuerzel": this.chosenTeacher,
                    "AID": this.chosenAID,
                    "GradeLevel": this.chosenGradeLevel,
                    "ALID": this.chosenGrade,
                    "Title": this.title,
                    "AuthKey": this.AuthKey
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "action/createPendingActivity.php", data));
                xml.send();
                xml.onload = function () {
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.chooseTeacher("");
                        self.chooseGradeLevel("");
                        self.chooseGradeOfActivity("", "");
                        self.chooseActivity("", "");
                        window.location.replace("../");
                    } else {
                        window.location.replace("../../");
                    }
                }
            }
        },

        // appends the data to be send to the url in the correct format
        echoParams(url, data) {
            var string = url + "?";
            for (key in data) {
                string += key + "=" + data[key] + "&";
            }
            return string;
        },

        //sets the state to logged in and asignes the user data to its designated variable
        login(data) {
            this.loggedIn = true;
            this.userData = data;
        },
        // function that is called in created upon changing to this page
        // retrieves the login informations and initalizes the call for the user data
        init() {
            this.SID = this.getCookie("SID");
            this.AuthKey = this.getCookie("AuthKey");
            this.getUserInfos(this.login);
            this.getAllActivities("");
        },

        // returns the value of the specified cookie or an empty string
        getCookie: function (cname) {
            let name = cname + "=";
            let cookies = decodeURIComponent(document.cookie).split(';');
            for (let i = 0; i < cookies.length; i++) {
                if (cookies[i].trimStart().indexOf(name) == 0) {
                    return cookies[i].trimStart().substring(name.length);
                }
            }
            return "";
        }
    },
    //function that is called upon changing into this folder
    created() {
        this.init();
    }
});