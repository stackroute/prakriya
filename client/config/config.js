let locations = [
  'SR1',
  'SR2',
  'SR3'
];

let modes = [
  'Hybrid',
  'Immersive',
  'Online'
];

const feedback = {
  EXTRA: `Your feedback is invaluable! It helps us measure the immersive program and improve the effectiveness Please fill up the form frankly and completely. Please indicate your opinion by a tick mark where necessary, keeping in mind the response interpretation.`,
  STARS: `1 – Strongly Disagree. 2 - Disagree. 3 – Some What. 4 - Agree. 5 – Strongly Agree.`,
  CATEGORIES: [
    {
      type: "relevance",
      alias: "RELEVENCE",
      options: [
        "The objectives were clearly defined at the beginning of the program",
        "The stated objectives for the Immersive program have been met successfully",
        "This program relevance to learn the new set of tech for Web development",
        "This program is relevant to my role/job",
        "This program made good use of my time"
      ]
    }, {
      type: "training",
      alias: "TRAINING METHODOLOGY",
      options: [
        "Program was stimulating and challenging",
        "Relevant learning material and reference materials were provided",
        "Program is paced well",
        "Assignments helped in implementing technologies covered"
      ]
    }, {
      type: "confidence",
      alias: "CONFIDENCE LEVEL GAINED ON THE TOPICS",
      options: []
    }, {
      type: "mentors",
      alias: "MENTORS",
      options: [
        "Mentor Knowledge of the Subject",
        "Ability to technically challenge and help learn",
        "Interest and involvement in the program",
        "Responsiveness to questions/ queries", "Overall ability to mentor"
      ]
    }, {
      type: "facilities",
      alias: "FACILITIES / INFRASTRUCTURE",
      options: [
        "Environment / Workspace",
        "Quality and speed of Internet / Network",
        "The facility was clean and well maintained",
        "Overall Infrastructure"
      ]
    }, {
      type: "overall",
      alias: "OVERALL SATISFACTION",
      options: [
        "How would you rate your overall satisfaction after completing this program",
        "How would you rate yourself in terms of confidence level",
        "How likely are you to recommend this program to others in your organization"]
    }
  ]
};

const config = {
  FEEDBACK: feedback,
	MODES: modes,
  LOCATIONS: locations
};

module.exports = config;
