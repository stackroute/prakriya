let config = {
	jwtSecret: "MyS3cr3tK3Y",
  jwtSession: {
      session: false
  },
  ALL: ['admin', 'administrator', 'mentor', 'candidate'],
	ADMIN: ['admin'],
	ADMINISTRATOR: ['administrator'],
	MENTOR: ['mentor'],
	CANDIDATE: ['candidate'],
	ADMCAN: ['administrator', 'candidate'],
	MENCAN: ['mentor', 'candidate'],
	ADMMEN: ['administrator', 'mentor']
}

module.exports = config;