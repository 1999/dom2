# What is this?
DOM2 is a Vanilla JS DOM manipulation library for modern (Chrome 5+, Firefox 4+, IE9+) browsers with a jQuery-like chainable syntax.

# How does it work?
DOM2 adds "$" (get DOM element) and "$$" (get all DOM elements) functions to window. Using these functions you can get DOM2 objects associated with the DOM nodes (HTMLElements or NodeLists). All created objects share the same prototype, which contains "html", "append", "click" and other useful jQuery-like chainable methods.

# I don't like the new DOM-like objects
You can also use [DOM5](http://github.com/1999/dom5) library which creates a mixin in the prototype chains of the DOM elements. Using DOM5 you can use new methods like "html", "append", "click" etc. at the same time with native DOM elements' stuff like "appendChild", "style", "addEventListener" etc.

# Usage
```javascript
$(document.body.firstChild, "section").addClass("some", "class").data({
	json: true
}).attr("id", Math.random() + "")
	.removeAttr("id")
	.css("cssFloat", "left")
	.html("some text");
```
