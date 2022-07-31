const logger = require("./../config/winston");
const moment = require("moment");

function Logging(ip, message) {

  var time = "["+moment.unix(moment(Date.now()).unix()).format("DD/MM/YYYY:hh:mm:ss ")+"+0530]"
  var whatis = ip+" "+time+" "+message;

  logger.error(whatis);
}

module.exports = Logging;
