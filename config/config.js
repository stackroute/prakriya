let BASEDATA = {
	ACCESS_CONTROLS: [
		{
			name: 'Users',
			code: 'USERS'
		},
		{
			name: 'Roles',
			code: 'ROLES'
		},
		{
			name: 'Candidates',
			code: 'CANDIDATES'
		},
		{
			name: 'Mentor Connect',
			code: 'MENTOR_CONN'
		},
		{
			name: 'Projects',
			code: 'PROJECTS'
		},
		{
			name: 'Courses',
			code: 'COURSES'
		},
		{
			name: 'Bulk Upload',
			code: 'BULK_UPLOAD'
		},
		{
			name: 'Program Flow',
			code: 'PROG_FLOW'
		},
		{
			name: 'Assessment Tracker',
			code: 'ASSG_TRACKER'
		},
		{
			name: 'My Profile',
			code: 'MY_PROF'
		},
		{
			name: 'Evaluation Forms',
			code: 'EVAL_FORMS'
		},
		{
			name: 'Feedback',
			code: 'FEEDBACK'
		},
		{
			name: 'Attendance',
			code: 'ATTENDANCE'
		},
		{
			name: 'Waves',
			code: 'WAVES'
		}
	],
	ADMIN_ROLE: {
		name: 'admin',
		controls: [
			'USERS',
			'ROLES'
		]
	},
	ADMIN_USER: {
		username: 'admin',
		password: 'admin',
		name: 'Admin',
		email: 'admin@stackroute.in',
		role: 'admin'
	}
};

let EMAIL = {
	USERNAME: 'srprakriya@gmail.com',
	PASSWORD: 'prakriya@123',
	SERVICE_PROVIDER: 'Gmail'
};

let config = {
	BASEDATA: BASEDATA,
	jwtSecret: 'MyS3cr3tK3Y',
  jwtSession: {
    session: false
  },
  EMAIL: EMAIL,
  ALL: ['admin', 'wiproadmin', 'sradmin', 'mentor', 'candidate'],
	ADMIN: ['admin', 'wiproadmin', 'sradmin'],
	ADMINISTRATOR: ['wiproadmin', 'sradmin'],
	MENTOR: ['mentor'],
	CANDIDATE: ['candidate'],
	ADMCAN: ['wiproadmin', 'sradmin', 'candidate'],
	MENCAN: ['mentor', 'candidate'],
	ADMMEN: ['wiproadmin', 'sradmin', 'mentor']
};

module.exports = config;
