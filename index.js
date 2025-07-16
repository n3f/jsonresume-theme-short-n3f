var fs = require("fs");
var Handlebars = require("handlebars");
var marked = require('marked');

function render(resume) {
	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	var template = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");
	// var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	// Nicer dates
	Handlebars.registerHelper('date', function(date) {
	  var theDate = new Date(date);

	  return months[theDate.getMonth()] + ' ' + theDate.getFullYear();
	});

	return Handlebars.compile(template)({
		css: css,
		resume: resume
	});
}

Handlebars.registerHelper('paragraphSplit', function(plaintext) {
    var i, output = '',
        lines = plaintext.split(/\r\n|\r|\n/g);
    for (i = 0; i < lines.length; i++) {
        if(lines[i]) {
            output += '<p>' + lines[i] + '</p>';
        }
    }
    return new Handlebars.SafeString(output);
});

Handlebars.registerHelper('markdownify', function(text, options) {
    if (!text) return '';
		const result = marked.parse(text);
		if (options?.hash?.stripParagraphs) {
			// Strip <p> tags from the result
			const stripped = result.replace(/<p>(.*?)<\/p>/g, '$1');
			return new Handlebars.SafeString(stripped);
		}
    return new Handlebars.SafeString(result);
});

module.exports = {
	render: render
};
