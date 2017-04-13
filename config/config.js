let config = {
	jwtSecret: "MyS3cr3tK3Y",
  jwtSession: {
      session: false
  },
	ADMIN: ['admin'],
	ADMINISTRATOR: ['administrator'],
	MENTOR: ['mentor'],
	CANDIDATE: ['candidate'],
	ADMCAN: ['administrator', 'candidate'],
	MENCAN: ['mentor', 'candidate']
}

module.exports = config;