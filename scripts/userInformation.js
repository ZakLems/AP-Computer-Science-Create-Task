const fs = require("fs");
const prompt = require("prompt-sync")();

//Definitions
let data;
try {
	data = fs.readFileSync("./scripts/data/courseData.json", "utf-8");
	data = JSON.parse(data);
	//console.log(data);
} catch (err) {
	console.log(err);
}

const graduationRequirements = [
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
}
const userInfo = new userBasics("Razak Diallo", 9, 100342969);
console.log(userInfo);

//add courses declarations/functions
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}
function selectableCourses(courses, year) {
	if (year == 1) {
		allCourses = courses["preHighschool"];
	} else if (year == 2) {
		var allCourses = courses["preHighschool"].concat(courses["freshman"]);
	} else if (year == 3) {
		var allCourses = courses["preHighschool"].concat(courses["freshman"], courses["sophomore"]);
	} else if (year == 4) {
		var allCourses = courses["preHighschool"].concat(courses["freshman"], courses["sophomore"], courses["junior"]);
	}
	var preRequisiteList = [];
	if (year == 0) {
		preRequisiteList = data.filter((course) => course.prerequisites == "");
	} else {
		for (let i = 0; i < allCourses.length; i++) {
			preRequisiteList = preRequisiteList.concat(
				data.filter((course) => course.prerequisites == allCourses[i].id || course.prerequisites == "")
			);
		}
	}

	return preRequisiteList.filter(onlyUnique);
}
function courseIDtoCourseOBJ(courseID) {
	foundIndex = data.findIndex(function (course, index) {
		if (course.id == courseID) {
			return true;
		}
	});
	let found = data[foundIndex];
	return found;
}
function courseArraytoCourseArrayOBJ(courseArray) {
	newArray = [];
	for (let i = 0; i < courseArray.length; i++) {
		newArray.push(courseIDtoCourseOBJ(courseArray[i]));
	}
	return newArray;
}
var currentSelectedYear = 0;
let userCourses = { preHighschool: [], freshman: [], sophomore: [], junior: [], senior: [] };

//add courses from before highschool
userCourses.preHighschool = courseArraytoCourseArrayOBJ(["A1", "B", "G"]);

var deletionList = [];
for (let i = 0; i < userCourses.preHighschool.length; i++) {
	if (
		selectableCourses(userCourses, currentSelectedYear)
			.map((courses) => courses.id)
			.includes(userCourses.preHighschool[i].id)
	) {
		console.log(`${userCourses.preHighschool[i].name} is allowed`);
	} else {
		console.log(`${userCourses.preHighschool[i].name} doesn't have the required prerequisites! Removing from list.`);
		deletionList.push(userCourses.preHighschool[i].name);
	}
}
for (let i = 0; i < deletionList.length; i++) {
	userCourses.preHighschool.splice(
		userCourses.preHighschool.findIndex(function (course, index) {
			if (course.id == deletionList[i].id) {
				return true;
			}
		}),
		1
	);
}
currentSelectedYear += 1;

//add courses from freshman
userCourses.freshman = courseArraytoCourseArrayOBJ(["C", "G", "A2", "ART2"]);

var deletionList = [];
for (let i = 0; i < userCourses.freshman.length; i++) {
	if (
		selectableCourses(userCourses, currentSelectedYear)
			.map((courses) => courses.id)
			.includes(userCourses.freshman[i].id)
	) {
		console.log(`${userCourses.freshman[i].name} is allowed`);
	} else {
		console.log(`${userCourses.freshman[i].name} doesn't have the required prerequisites! Removing from list.`);
		deletionList.push(userCourses.freshman[i].name);
	}
}
for (let i = 0; i < deletionList.length; i++) {
	userCourses.freshman.splice(
		userCourses.freshman.findIndex(function (course, index) {
			if (course.id == deletionList[i].id) {
				return true;
			}
		}),
		1
	);
}
console.log(userCourses.preHighschool.map((courses) => courses.name));
console.log(userCourses.freshman.map((courses) => courses.name));
currentSelectedYear += 1;
