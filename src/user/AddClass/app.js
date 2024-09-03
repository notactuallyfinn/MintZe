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
            classes: [],
            chosenSFID: "",
            chosenType: "",
            possiblePoints: [],
            chosenPoints: "",
            gradeLevels: [],
            chosenGradeLevel: "",
            possibleTeachers: [],
            chosenTeacher: "",
            title: "",
            searchQueries: {
                allClasses: "",
                possiblePoints: "",
                gradeLevels: "",
                possibleTeachers: "",
                setTitle: ""
            }
        }
    },
    watch: {
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.allClasses': function (val) {
            this.getAllClasses(val);
        },
        // sets the variable to be watched
        // when used in HTML the function is invoked
        'searchQueries.possiblePoints': function (val) {
            this.getPossiblePoints(val, 0);
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
        // calls the script that gets all possible classes to be chosen from from the data base
        getAllClasses: function (filter) {
            let self = this;
            let data = {
                "SID": this.SID,
                "AuthKey": this.AuthKey,
                "filter": filter
            }
            let xml = new XMLHttpRequest();
            xml.open("GET", this.echoParams(this.apiEndpoint + "get/possibleClasses.php", data));
            xml.send();
            xml.onload = function () {
                let data = JSON.parse(this.response);
                if (data.Status == "200") {
                    self.classes = data.Items;
                } else {
                    window.location.replace("../../");
                }
            }
        },
        // calls the script that gets the possible points one can achieve from the data base
        getPossiblePoints: function (filter, exact) {
            if (this.chosenSFID != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "AuthKey": this.AuthKey,
                    "filter": filter,
                    "Exact": exact
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "get/possiblePoints.php", data));
                xml.send();
                xml.onload = function () {
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.possiblePoints = data.Items;
                    } else {
                        window.location.replace("../../");
                    }
                }
            }
        },
        // calls the script that gets the possible grade levels the class can be taken at from the data base
        getGradeLevels: function (filter) {
            if (this.chosenSFID != "" && "" + this.chosenPoints != "") {
                if (!filter.startsWith("Q")){
                    filter = "Q" + filter;
                }
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
            } else {
                console.log("a" + this.chosenSFID + "a");
                console.log("a" + this.chosenPoints + "a");
            }
        },
        // calls the script that gets the possible teachers that can confirm the users participation from the data base
        getPossibleTeachers: function (filter) {
            if (this.chosenSFID != "" && "" + this.chosenPoints != "" && this.chosenGradeLevel != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "AuthKey": this.AuthKey,
                    "class": this.chosenSFID,
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
        // sets the chosen class and calls other required functions
        chooseClass(SFID, Name, Type) {
            this.chosenSFID = SFID;
            this.chosenType = Type;
            this.getAllClasses(Name);
            this.chosenPoints = "";
            this.chosenGradeLevel = "";
            this.chosenTeacher = "";
            this.getPossiblePoints("", 0);
        },
        // function that can be run from a button in HTML
        // sets the chosen points and calls other required functions
        choosePoints(Punkte) {
            this.chosenPoints = Punkte;
            this.getPossiblePoints(Punkte, 1);
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
        // calls the script that creates the pending request of the student for participating in the class
        createPendingClass(){
            if (this.chosenSFID != "" && "" + this.chosenPoints != "" && this.chosenGradeLevel != "" && this.chosenTeacher != "") {
                let self = this;
                let data = {
                    "SID": this.SID,
                    "Kuerzel": this.chosenTeacher,
                    "SFID": this.chosenSFID,
                    "GradeLevel": this.chosenGradeLevel,
                    "Points": this.chosenPoints,
                    "Title": this.title,
                    "AuthKey": this.AuthKey
                }
                let xml = new XMLHttpRequest();
                xml.open("GET", this.echoParams(this.apiEndpoint + "action/createPendingClasses.php", data));
                xml.send();
                xml.onload = function () {
                    console.log(this.response);
                    let data = JSON.parse(this.response);
                    if (data.Status == "200") {
                        self.chooseTeacher("");
                        self.chooseGradeLevel("");
                        self.choosePoints("");
                        self.chooseClass("", "", "");
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
            this.getAllClasses("");
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