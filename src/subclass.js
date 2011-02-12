function __extends__(subclass, superclass) {
	function proxy() {}
	proxy.prototype = superclass.prototype;
	subclass.prototype = new proxy();
};
