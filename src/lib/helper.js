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

function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  return `${(bytes / Math.pow(1024, i)).toFixed(2) * 1} ${sizes[i]}`;
}

const tempMethods = { ctof, ftoc };
const weightMethods = { lbstokg, kgtolbs };

module.exports.removeCommandText = removeCommandText;
module.exports.percentageOfLikes = percentageOfLikes;
module.exports.tempMethods = tempMethods;
module.exports.weightMethods = weightMethods;
module.exports.readableBytes = readableBytes;
