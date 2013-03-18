/**
 * Copyright (c) 2013 Dmitry Sorin <info@staypositive.ru>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @author Dmitry Sorin <info@staypositive.ru>
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 */
(function (w) {
	"use strict";

	w["$"] = function () {
		var args = Array.prototype.concat.call(Array.prototype.slice.call(arguments), false);
		return querySelectorElem.apply(null, args);
	};

	w["$$"] = function () {
		var args = Array.prototype.concat.call(Array.prototype.slice.call(arguments), true);
		return querySelectorElem.apply(null, args);
	};

	var domElementProto = {
		find: function (selector) {
			if (this.dom instanceof NodeList)
				throw new Error("Can't search descendants in NodeList");

			return w["$"](this.dom, selector);
		},

		findAll: function (selector) {
			if (this.dom instanceof NodeList)
				throw new Error("Can't search descendants in NodeList");

			return w["$$"](this.dom, selector);
		},

		click: function (callback) {
			if (arguments.length === 0) {
				if (this.dom instanceof NodeList)
					throw new Error("Can't simulate multiple clicks of NodeList elements");

				if (this.dom.click) {
					this.dom.click();
				} else {
					var evt = document.createEvent("MouseEvents");
					evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					this.dom.dispatchEvent(evt);
				}

				return;
			}

			if (this.dom instanceof HTMLElement) {
				this.dom.addEventListener("click", callback, false);
			} else {
				for (var j = 0; j < this.dom.length; j++) {
					this.dom[j].addEventListener("click", callback, false);
				}
			}

			return this;
		},

		clone: function (deep) {
			if (this.dom instanceof NodeList)
				throw new Error("Can't clone NodeList");

			deep = deep || false;
			return this.dom.cloneNode(deep);
		},

		remove: function () {
			if (this.dom instanceof HTMLElement) {
				this.dom.parentNode.removeChild(this.dom);
			} else {
				for (var j = 0; j < this.dom.length; j++) {
					this.dom[j].parentNode.removeChild(this.dom[j]);
				}
			}
		},

		html: function (newHTML) {
			if (newHTML !== undefined) {
				if (this.dom instanceof HTMLElement) {
					this.dom.innerHTML = newHTML;
				} else {
					for (var j = 0; j < this.dom.length; j++) {
						this.dom[j].innerHTML = newHTML;
					}
				}

				return this;
			}

			if (this.dom instanceof NodeList)
				throw new Error("Can't get innerHTML of NodeList");

			return this.dom.innerHTML;
		},

		text: function (newContent) {
			if (newContent !== undefined) {
				if (this.dom instanceof HTMLElement) {
					this.dom.textContent = newContent;
				} else {
					for (var j = 0; j < this.dom.length; j++) {
						this.dom[j].textContent = newContent;
					}
				}

				return this;
			}

			if (this.dom instanceof NodeList)
				throw new Error("Can't get textContent of NodeList");

			return this.dom.textContent;
		},

		empty: function () {
			if (this.dom instanceof HTMLElement) {
				this.dom.html("");
			} else {
				for (var j = 0; j < this.dom.length; j++) {
					this.dom[j].html("");
				}
			}

			return this;
		},

		append: function (contents) {
			if (this.dom instanceof NodeList)
				throw new Error("Can't add contents to multiple nodes");

			if (typeof contents === "string") {
				this.dom.insertAdjacentHTML("beforeEnd", contents);
			} else {
				if (contents.dom instanceof HTMLElement) {
					this.dom.appendChild(contents.dom);
				} else if (contents.dom instanceof NodeList) {
					for (var j = 0; j < contents.dom.length; j++) {
						this.dom.appendChild(contents.dom[j]);
					}
				}
			}

			return this;
		},

		prepend: function (elements) {
			if (this.dom instanceof NodeList)
				throw new Error("Can't add contents to multiple nodes");

			if (typeof contents === "string") {
				this.dom.insertAdjacentHTML("afterBegin", contents);
			} else {
				if (contents.dom instanceof HTMLElement) {
					if (this.hasChildNodes()) {
						this.insertBefore(contents.dom, this.firstChild);
					} else {
						this.appendChild(contents.dom);
					}
				} else if (contents.dom instanceof NodeList) {
					for (var elem in contents.dom) {
						if (this.hasChildNodes()) {
							this.insertBefore(elem, this.firstChild);
						} else {
							this.appendChild(elem);
						}
					}
				}
			}

			return this;
		},

		before: function (contents) {
			if (this.dom instanceof NodeList)
				throw new Error("Can't add contents to multiple nodes");

			if (typeof contents === "string") {
				this.dom.insertAdjacentHTML("beforeBegin", contents);
			} else {
				if (contents.dom instanceof HTMLElement) {
					this.parentNode.insertBefore(contents.dom, this);
				} else if (contents.dom instanceof NodeList) {
					for (var elem in contents.dom) {
						this.parentNode.insertBefore(elem, this);
					}
				}
			}

			return this;
		},

		after: function (contents) {
			if (this.dom instanceof NodeList)
				throw new Error("Can't add contents to multiple nodes");

			if (typeof contents === "string") {
				this.dom.insertAdjacentHTML("afterEnd", contents);
			} else {
				if (contents.dom instanceof HTMLElement) {
					if (this.nextSibling) {
						this.parentNode.insertBefore(contents.dom, this.nextSibling);
					} else {
						this.parentNode.appendChild(contents.dom);
					}
				} else if (contents.dom instanceof NodeList) {
					for (var elem in contents.dom) {
						if (this.nextSibling) {
							this.parentNode.insertBefore(elem, this.nextSibling);
						} else {
							this.parentNode.appendChild(elem);
						}
					}
				}
			}

			return this;
		},

		val: function (newValue) {
			if (newValue === undefined) {
				if (this.dom instanceof NodeList)
					throw new Error("Can't get value of NodeList");

				return this.dom.value;
			}
			
			if (this.dom instanceof HTMLElement) {
				this.dom.value = newValue;
			} else {
				for (var elem in this.dom) {
					elem.value = newValue;
				}
			}

			return this;
		},

		addClass: function () {
			var classNames = Array.prototype.slice.call(arguments, 0);
			for (var i = 0; i < classNames.length; i++) {
				if (this.dom instanceof HTMLElement) {
					this.dom.classList.add(classNames[i]);
				} else {
					for (var j = 0; j < this.dom.length; j++) {
						this.dom[j].classList.add(classNames[i]);
					}
				}
			}
			
			return this;
		},

		/**
		 * if no aguments are supplied, clears all classes from the DOM element(s)
		 */
		removeClass: function () {
			var classNames = Array.prototype.slice.call(arguments, 0);
			if (classNames.length) {
				for (var i = 0; i < classNames.length; i++) {
					if (this.dom instanceof HTMLElement) {
						this.dom.classList.remove(classNames[i]);
					} else {
						for (var j = 0; j < this.dom.length; j++) {
							this.dom[j].classList.remove(classNames[i]);
						}
					}
				}
			} else {
				if (this.dom instanceof HTMLElement) {
					this.dom.className = "";
				} else {
					for (var j = 0; j < this.dom.length; j++) {
						this.dom[j].className = "";
					}
				}
			}
			
			return this;
		},

		attr: function (key, value) {
			if (value === undefined && typeof key === "string") {
				if (this.dom instanceof NodeList)
					throw new Error("Can't get attributes for multiple nodes");

				return this.dom.getAttribute(key);
			}

			var attributes = {};
			if (arguments.length === 1) {
				attributes = key;
			} else {
				attributes[key] = value;
			}

			for (var key in attributes) {
				if (this.dom instanceof HTMLElement) {
					this.dom.setAttribute(key, attributes[key]);
				} else {
					for (var j = 0; j < this.dom.length; j++) {
						this.dom[j].setAttribute(key, attributes[key]);
					}
				}
			}
			
			return this;
		},

		removeAttr: function (key) {
			if (this.dom instanceof HTMLElement) {
				this.dom.removeAttribute(key);
			} else {
				for (var j = 0; j < this.dom.length; j++) {
					this.dom[j].removeAttribute(key);
				}
			}

			return this;
		},

		data: function (key, value) {
			if (value === undefined && typeof key === "string") {
				if (this.dom instanceof NodeList)
					throw new Error("Can't get dataset for multiple nodes");

				return (this.dom.dataset[key] || "");
			}

			var data = {};
			if (arguments.length === 1) {
				data = key;
			} else {
				data[key] = value;
			}

			for (var key in data) {
				if (this.dom instanceof HTMLElement) {
					this.dom.dataset[key] = data[key];
				} else {
					for (var j = 0; j < this.dom.length; j++) {
						this.dom[j].dataset[key] = data[key];
					}
				}
			}

			return this;
		},

		/**
		 * if no aguments are supplied, clears all dataset from the DOM element(s)
		 */
		removeData: function () {
			var datasetKeys = Array.prototype.slice.call(arguments, 0);
			var key;

			if (this.dom instanceof HTMLElement) {
				for (key in this.dom.dataset) {
					if (!datasetKeys.length || datasetKeys.indexOf(key) !== -1) {
						delete this.dom.dataset[key];
					}
				}
			} else {
				for (var j = 0; j < this.dom.length; j++) {
					for (key in elem.dataset) {
						if (!datasetKeys.length || datasetKeys.indexOf(key) !== -1) {
							delete this.dom[j].dataset[key];
						}
					}
				}
			}

			return this;
		},

		css: function (key, value) {
			if (value === undefined && typeof key === "string") {
				if (this.dom instanceof NodeList)
					throw new Error("Can't get styles for multiple nodes");

				return this.dom.style[key];
			}

			var styles = {};
			if (arguments.length === 1) {
				styles = key;
			} else {
				styles[key] = value;
			}

			for (var key in styles) {
				if (this.dom instanceof HTMLElement) {
					this.dom.style[key] = styles[key];
				} else {
					for (var j = 0; j < this.dom.length; j++) {
						this.dom[j].style[key] = styles[key];
					}
				}
			}

			return this;
		}
	};

	var querySelectorElem = function () {
		var parentElement;
		var selector;
		var getAllElements;
		var domElem;

		if (arguments.length === 2 && (arguments[0] instanceof HTMLElement || arguments[0] instanceof NodeList)) { // $(document.body)
			domElem = arguments[0];
		} else if (arguments.length === 2 && /^<.+>$/.test(arguments[0])) { // $("<div>text</div>")
			var tmpElem = document.createElement("div");
			tmpElem.innerHTML = arguments[0];

			domElem = (arguments[1] || tmpElem.childNodes.length > 1)
				? tmpElem.childNodes
				: tmpElem.firstChild;
		} else {
			switch (arguments.length) {
				case 2: // selector, getAllElements
					parentElement = document;
					selector = arguments[0];
					getAllElements = arguments[1];
					break;

				case 3: // parent, selector, getAllElements
					parentElement = arguments[0];
					selector = arguments[1];
					getAllElements = arguments[2];
					break;

				default:
					throw new RangeError("Only 1 or 2 arguments allowed");
			}

			if (!getAllElements) {
				domElem = parentElement.querySelector(selector);
				if (!domElem) {
					return null;
				}
			} else {
				domElem = parentElement.querySelectorAll(selector);
			}
		}

		return Object.create(domElementProto, {
			dom: {
				writable: false,
				configurable: false,
				value: domElem
			}
		});
	};
})(window);
