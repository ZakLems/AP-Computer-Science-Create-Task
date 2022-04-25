const fs = require("fs");
const prompt = require("prompt-sync")();

//Referencing course roster
let data;
try {
	data = fs.readFileSync("./scripts/data/courseData.json", "utf-8");
	data = JSON.parse(data);
	//console.log(data);
} catch (err) {
	console.log(err);
}

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

//Validation (prerequisites, grade level)
function selectableCoursesBasedOnPrerequisites(courses, year) {
	if (year == 1) {
		allCourses = courses["preHighschool"];
	} else if (year == 2) {
		var allCourses = courses["preHighschool"].concat(courses["freshman"]);
	} else if (year == 3) {
		var allCourses = courses["preHighschool"].concat(courses["freshman"], courses["sophomore"]);
	} else if (year == 4) {
		var allCourses = courses["preHighschool"].concat(courses["freshman"], courses["sophomore"], courses["junior"]);
	}
	var allowedCourses = [];
	if (year == 0 || allCourses.length == 0) {
		allowedCourses = data.filter((course) => course.prerequisites == "");
	} else {
		for (let i = 0; i < allCourses.length; i++) {
			allowedCourses = allowedCourses.concat(
				data.filter((course) => course.prerequisites == allCourses[i].id || course.prerequisites == "")
			);
		}
	}
	return allowedCourses.filter(onlyUnique);
}

function selectableCoursesBasedOnGradeLevel(year) {
	var allowedCourses = [];
	if (year == 1) {
		allowedCourses = data.filter((course) => course.gradeLevel.includes(9));
	}
	if (year == 2) {
		allowedCourses = data.filter((course) => course.gradeLevel.includes(10));
	}
	if (year == 3) {
		allowedCourses = data.filter((course) => course.gradeLevel.includes(11));
	}
	if (year == 4) {
		allowedCourses = data.filter((course) => course.gradeLevel.includes(12));
	}

	return allowedCourses.filter(onlyUnique);
}

var currentSelectedYear = 0;
let userCourses = { preHighschool: [], freshman: [], sophomore: [], junior: [], senior: [] };

function addCourses(coursesToAdd) {
	//determine current selected year name
	let currentSelectedYearName;
	if (currentSelectedYear == 0) {
		currentSelectedYearName = "preHighschool";
	} else if (currentSelectedYear == 1) {
		currentSelectedYearName = "freshman";
	} else if (currentSelectedYear == 2) {
		currentSelectedYearName = "sophomore";
	} else if (currentSelectedYear == 3) {
		currentSelectedYearName = "junior";
	} else if (currentSelectedYear == 4) {
		currentSelectedYearName = "senior";
	}
	//add selected courses as object as referenced from data variable to master course list
	userCourses[currentSelectedYearName] = courseArraytoCourseArrayOBJ(coursesToAdd);

	//determine if user can take selected courses based on prerequisites and grades allowed to take course. Remove if lacking required prerequisites or not offered in grade (with exceptions for courses that require prerequisites to allow pre-highschool advancement).
	let deletionList = [];

	for (let i = 0; i < userCourses[currentSelectedYearName].length; i++) {
		if (
			selectableCoursesBasedOnPrerequisites(userCourses, currentSelectedYear)
				.map((courses) => courses.id)
				.includes(userCourses[currentSelectedYearName][i].id)
		) {
			console.log(`${userCourses[currentSelectedYearName][i].name} has the required prerequisites`);
		} else {
			console.log(
				`${userCourses[currentSelectedYearName][i].name} doesn't have the required prerequisites! Removing from list.`
			);
			deletionList.push(userCourses[currentSelectedYearName][i].id);
		}
	}
	console.log("");
	if (currentSelectedYearName != "preHighschool") {
		for (let i = 0; i < userCourses[currentSelectedYearName].length; i++) {
			if (userCourses[currentSelectedYearName][i].prerequisites == "") {
				if (
					selectableCoursesBasedOnGradeLevel(currentSelectedYear)
						.map((courses) => courses.id)
						.includes(userCourses[currentSelectedYearName][i].id)
				) {
					console.log(
						`${userCourses[currentSelectedYearName][i].name} is in the appropriate grade level for the student.`
					);
				} else {
					console.log(
						`${userCourses[currentSelectedYearName][i].name} doesn't provide classes for the student's grade level! Removing from list.`
					);
					deletionList.push(userCourses[currentSelectedYearName][i].id);
				}
			}
		}
	}
	console.log(deletionList);
	userCourses[currentSelectedYearName] = userCourses[currentSelectedYearName].filter(function (e) {
		return !deletionList.includes(e.id);
	});
}
currentSelectedYear = 1;
for (let i = 0; i < 1; i++) {
	addCourses(["A1", "B", "E9", "MP1", "CS", "G"]);
	currentSelectedYear += 1;
}

//graduation requirements
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
