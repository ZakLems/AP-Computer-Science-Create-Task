const fs = require("fs");

//Definitions
fs.readFile("./scripts/data/courseData.json", "utf-8", (err, jsonString) => {
	if (err) {
		console.log(err);
	} else {
		try {
			const data = JSON.parse(jsonString);
			//console.log(data);
		} catch (err) {
			console.log("Error parsing JSON", err);
		}
	}
});
var graduationRequirements = [
	"Fine Art",
	"English 11",
	"English 12",
	"English 10",
	"English 9",
	"Financial Literacy",
	"Health",
	"Physical Education",
	"Math",
	"Science",
	"Biology",
	"Government",
	"World History",
	"U.S. History",
	"Technology Education",
	"Language",
];

//basic user information
function userBasics(name, gradeLevel, studentID, coursesTaken) {
	this.name = name;
	this.gradeLevel = gradeLevel;
	this.studentID = studentID;
	this.coursesTaken = coursesTaken;
}
var userInfo = new userBasics("Razak Diallo", 9, 100342969, ["A1", "B"]);
//console.log(userInfo);
