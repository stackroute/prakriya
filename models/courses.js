 var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Category = new Schema({
				Name: String,
				Mentor: [String],
				Duration: String,
			  Videos: [String],
   			Blogs: [String],
   			Docs: [String],
})

var courses = new Schema({
        CourseID: {type: Number, unique: true},
			  CourseName: String,
			  Categories: [Category],
			  Duration: String,
        AssessmentCategories: [String],
   			Removed: {type:Boolean, default:false}
	});

module.exports = mongoose.model('Courses', courses);