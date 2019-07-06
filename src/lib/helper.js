const removeCommandText = (command, text) => {
  return text.replace(command, "").trim();
};

const percentageOfLikes = (likes, dislikes) => {
  return Math.floor((likes / (likes + dislikes)) * 100);
};

const ctof = celsius => {
  return Math.floor(celsius * (9 / 5) + 32);
};

const ftoc = fahrenhiet => {
  return Math.floor((fahrenhiet - 32) * (5 / 9));
};

const lbstokg = lbs => {
  return Math.floor(lbs / 2.205);
};

const kgtolbs = lbs => {
  return Math.floor(lbs * 2.205);
};

const tempMethods = { ctof, ftoc };
const weightMethods = { lbstokg, kgtolbs };

module.exports.removeCommandText = removeCommandText;
module.exports.percentageOfLikes = percentageOfLikes;
module.exports.tempMethods = tempMethods;
module.exports.weightMethods = weightMethods;
