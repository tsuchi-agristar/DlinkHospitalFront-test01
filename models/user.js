var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	_id: String,
	profile: Object
});

module.exports = mongoose.model('DlinkUser', userSchema);
