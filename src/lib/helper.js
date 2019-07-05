const removeCommandText = (command, text) => {
  return text.replace(command, "").trim();
};

const percentageOfLikes = (likes, dislikes) => {
  return Math.floor((likes / (likes + dislikes)) * 100);
};

module.exports.removeCommandText = removeCommandText;
module.exports.percentageOfLikes = percentageOfLikes;
