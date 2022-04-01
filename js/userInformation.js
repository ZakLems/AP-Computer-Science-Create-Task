function userBasics(name, gradeLevel, studentID, coursesTaken, interests, totalCredits){
    this.name = name;
    this.gradeLevel = gradeLevel;
    this.studentID = studentID;
    this.coursesTaken = coursesTaken;
    this.interests = interests;
    this.totalCredits = totalCredits;
}

function course() {
    this.name;
    this.graduationRequirement;
    this.prerequisites;
    this.creditValue;
    this.gradeWeight;
    this.term;
    this.department;
    this.finalGrade;
}

dave = new userBasics('raza', 11, 100342969, '','','')
console.log(dave)