// **************************************************************************
// Copyright 2007 - 2008 The JSLab Team, Tavs Dokkedahl and Allan Jacobs
// Contact: http://www.jslab.dk/contact.php
//
// This file is part of the JSLab DOM Correction (JDC) Program.
//
// JDC is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// any later version.
//
// JDC is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.
// ***************************************************************************
// File created 2008-12-17 17:11:03

// JDC Version: 1.0.3
// EPE revision: 92
// UEM revision: 75
// Release date: 2008-09-30
// [epe.ie.htmlelement.js]

// Content
// 1. User configurable settings
// 2. Element creation
// 3. Element property change
// 4. Element chache
// 5. Functions for collabaration with external scripts (hooks)
// 6. Redeclaration of native JS functions/methods
// 7. Prototype handling
// 8. Element constructor declarations

// Works for IE version 6.0 and above [EDIT: Not IE 8 proper release - Graham Robertson]
if (document.createEventObject) {

	/***********************************************
	*
	*
	*  Section 1 - User configurable settings
	*
	*
	***********************************************/

	// Declare namespace
	var EPE = {};

	// Cache elements between creation and insertion. This is nessesary in
	// a number of situations especially when using innerHTML
	// 1 = on, 0 = off. Default value is 1
	// See http://www.jslab.dk/epe.features.php#enable.cache for more info
	EPE.CACHE_ELEMENTS = 1;

	// THERE ARE NO CONFIGURABLE SETTINGS BELOW THIS LINE

	/***********************************************
	*
	*
	*  Section 2 - Element creation
	*
	*
	***********************************************/

	// Save native createElement method
	EPE.IECreateElement = document.createElement;

	/**
	* Creates an element of the type specified by tag.  The element is wrapped
	* within an instance of a subclass of HTMLElement.
	* 
	* @param tag {String} The HTML tag name of the element type to create.
	* @returns a native element wrapped in an instance of HTMLElement.
	* @type HTMLElement
	*/
	EPE.createElement =
    function (tag) {
    	tag = tag.toLowerCase();
    	// Return an element wrapped in a proper [ELEMENT] constructor
    	// If no constructor exists use HTMLElement.
    	var elm = EPE.tags[tag] ? new EPE.tags[tag](tag) : new HTMLElement(tag);
    	// Cache element until it is inserted into document
    	if (EPE.CACHE_ELEMENTS)
    		EPE.cache.add(elm);
    	return elm;
    };

	// This assignment *must* come after the EPE.createElement declaration
	document.createElement = EPE.createElement;

	/**
	* Copy all methods and properties from real prototype to a given element's
	* pseudo-prototype.
	* 
	* This method is called when application code invokes the init method,
	* when a new node is attached to the document in innerHTML, and from
	* document createElement.
	* 
	* An element can only be extended once.  This method does nothing if the
	* given element has it's constructor property set.
	* 
	* @param elm  Element.
	* @param oCon Constructor.
	*/
	EPE.extend =
    function (elm, oCon) {
    	// If elm has a 'constructor' property is has already been extended.
    	// Elements may *not* be extended twice as this will cause unpredictable
    	// results for some workarounds. Calling EPE.extend twice could happen when 
    	// an element appends childs using innerHTML. The childs which are
    	// there prior to the innerHTML change will already have been extended.
    	if (!elm.constructor) {
    		// If constructor function for this element is not provided
    		// then get correct constructor function
    		// If constructor does not exist use HTMLElement
    		if (!oCon)
    			oCon = EPE.tags[elm.tagName.toLowerCase()] ? EPE.tags[elm.tagName.toLowerCase()] : HTMLElement;
    		// Set constructor property for easy comparison
    		elm.constructor = oCon;
    		// if element can have child nodes
    		if (elm.canHaveChildren) {
    			// Changes to innerHTML which are made before the node is attached to the document
    			// do not trigger onpropertychange. In this case we need to check whether the node being
    			// inserted has childnodes which have not been extended by EPE.
    			// See also the EPE.extend method for more info.
    			// The functions which can alter a document is
    			// appendChild
    			// insertBefore
    			// replaceChild
    			// Save ref. to original methods
    			elm._appendChild = elm.appendChild;
    			elm._insertBefore = elm.insertBefore;
    			elm._replaceChild = elm.replaceChild;
    			// Replace with EPE versions
    			elm.appendChild = EPE.appendChild;
    			elm.insertBefore = EPE.insertBefore;
    			elm.replaceChild = EPE.replaceChild;
    		}
    		// Copy properties from HTMLElement prototype
    		oPro = HTMLElement._prototype;
    		if (elm.nodeName != "OBJECT" && elm.nodeName != "APPLET") {
    			for (var p in oPro) {
    				elm[p] = oPro[p];
    			}
    		}
    		// Temp. solution for OBJECT and APPLET tags
    		else {
    			for (var p in oPro) {
    				try {
    					elm[p] = oPro[p];
    				}
    				catch (ex) {
    				}
    			}
    		}
    		// Copy properties from constructor prototype
    		// effectively overwritting duplicate properties
    		// defined on the HTMLElement
    		var oPro = oCon._prototype;
    		if (elm.nodeName != "OBJECT" && elm.nodeName != "APPLET") {
    			for (var p in oPro)
    				elm[p] = oPro[p];
    		}
    		// Temp. solution for OBJECT and APLLET tags
    		else {
    			for (var p in oPro) {
    				try {
    					elm[p] = oPro[p];
    				}
    				catch (ex) {
    				}
    			}
    		}
    		// If any auxiliary functions are registered for handling changes to
    		// nodes when they are created/inserted they are executed now, parsing
    		// the node as a single argument. Aux. functions are executed in the
    		// order in which they are registered.
    		EPE.PlugIn.executeCreate(elm);
    		// Enable property watching
    		EPE.enableWatch(elm);
    	}
    	return elm;
    };

	/**
	* Custom toString method of all element constructors
	* 
	* @returns the name of an element constructor formatted as in Firefox.
	* @type String
	*/
	EPE.constructorToString =
    function () {
    	var s = Function.prototype.toString.apply(this);
    	return s.match(/^function\s(\w+)/)[1];
    };

	/**
	* Extend existing elements onload.  This code *must* be attached as a load
	* event handler by application code to get called when the document finishes
	* loading. 
	* This handler will optionally call a load handler as a callback
	* function if the application code requires a load event handler attached
	* to the body element.
	* See http://www.jslab.dk/epe.installation.php for more information   
	*/
	EPE.init =
    function () {
    	// Extend all existing elements
    	var a = document.all;
    	var l = a.length;
    	for (var i = 0; i < l; i++) {
    		if (a[i].tagName != '!' && a[i].tagName != 'epe')
    			EPE.extend(a[i]);
    	}
    	// Execute aux. init functions which are registered
    	// by external scripts
    	for (var i = 0; i < EPE.init.aux.length; i++)
    		EPE.init.aux[i]();
    	// Execute original onload handler if any exist
    	if (EPE.__R1)
    		EPE.__R1();
    };

	/**
	* Storage for functions which should be executed after EPE has
	* initialized but before control is given back to the user
	* script.      
	*/
	EPE.init.aux = [];

	/***********************************************
	*
	*
	*  Section 3 - Element property change
	*
	*
	***********************************************/

	/**
	* Central point for enabling property watching.  This function may be
	* called from outside EPE.
	* 
	* Enabling property watching is accomplished by attaching EPE.checkInnerHTML
	* as a property change handler.  One side effect is that application code
	* registered change listeners may be called.
	* 
	* @param elm An element for which property watching will be enabled.
	*/
	EPE.enableWatch =
    function (elm) {
    	elm.attachEvent('onpropertychange', EPE.checkInnerHTML);
    };

	/**
	* Central point for disabling property watching.  This function may be
	* called from outside EPE.
	* 
	* Disabling property watching is accomplished by detaching EPE.checkInnerHTML
	* as a property change handler.  One side effect is that application code
	* registered change listeners will no longer be called.
	* 
	* @param elm An element for which property watching will be disabled.
	*/
	EPE.disableWatch =
    function (elm) {
    	elm.detachEvent('onpropertychange', EPE.checkInnerHTML);
    };

	/**
	* Watch handler for changes to a node which originate from altering innerHTML
	* or from property changes.  When this function executes the changes have
	* already been made and attached to the document.
	* 
	* Note: onpropertychange fires on the document object even though no pseudo
	*       (epe tag) contructor is attached to the document.   
	*    
	* Weird IE behavior: When assigning event handlers using attachEvent 'this' references the window object
	*                    so we use event.srcElement instead.       
	*/

	EPE.checkInnerHTML =
    function () {
    	// If source of event is document or window then no event.srcElement exist
    	// nor do we have to worry about innerHTML
    	// EPE handles document changes
    	if (event.srcElement && event.propertyName == 'innerHTML') {
    		// Sortcut
    		var elm = event.srcElement;
    		// All child nodes inserted by innerHTML
    		// should be extended by EPE
    		if (elm.childNodes) {
    			for (var i = 0; i < elm.childNodes.length; i++) {
    				if (elm.childNodes[i].tagName)
    					EPE.extendInnerHTML(elm.childNodes[i]);
    			}
    		}
    	}
    	// Aux. functions might handle changes to other properties
    	else {
    		if (event.srcElement)
    			EPE.PlugIn.executeChange(event.srcElement, event);
    		else if (this == document)
    			EPE.PlugIn.executeChange(document, event);
    	}
    };

	/**
	* Recursively extend all nodes added by an innerHTML change.
	* 
	* @param node The base HTML node for a depth-first recursion step.
	*/
	EPE.extendInnerHTML =
    function (node) {
    	// For each childnode
    	if (node.childNodes) {
    		for (var i = 0; i < node.childNodes.length; i++) {
    			// If childnode is an element and childnode has childnodes then recurse
    			if (node.childNodes[i].tagName && node.childNodes[i].childNodes)
    				EPE.extendInnerHTML(node.childNodes[i]);
    		}
    	}
    	// If node is an element node
    	if (node && node.tagName) {
    		// All nodes being attached to the document will
    		// execute this block at some point
    		// Extend the node. Node now supports the HTMLElement interface
    		EPE.extend(node);
    		// Execute onattach events
    		EPE.PlugIn.executeAttach(node);
    		// Temporary fix for nasty bug when assigning event handlers
    		// as properties
    		for (var p in node) {
    			if (/^on/i.test(p) && node[p] && window.UEM && node[p] != UEM.wrapper)
    				node.addEventListener(p.substring(2), node[p], false);
    		}
    	}
    };

	/***********************************************
	*
	*
	*  Section 4 - Element cache
	*
	*
	***********************************************/

	// If caching is turned on
	if (EPE.CACHE_ELEMENTS) {

		EPE.cache = EPE.IECreateElement('epe');
		document.documentElement.childNodes[0].appendChild(EPE.cache);

		EPE.cache.add =
      function (elm) {
      	if (elm.canHaveChildren) {
      		EPE.cache.appendChild(elm);
      		elm.cached = true;
      	}
      };

		EPE.cache.remove =
      function (elm) {
      	elm.cached = null;
      	if (elm.childNodes.length) {
      		for (var i = 0; i < elm.childNodes.length; i++)
      			if (elm.childNodes[i].cached)
      				EPE.cache.remove(elm.childNodes[i]);
      	}
      	EPE.cache.removeChild(elm);
      };
	}

	/***********************************************
	*
	*
	*  Section 5 - Functions for collabaration with
	*              external scripts (hooks)
	*
	*
	***********************************************/

	/**
	* Create a new EPE.PlugIn object.
	* 
	* @param t The element tag which this plugin is for. If not
	* provided then all elements are assumed.      
	*/
	EPE.PlugIn = function (t) {
		this.con = t ? EPE.tags[t.toLowerCase()] : HTMLElement;
		if (!this.con)
			throw new Error('EPE.PlugIn: No constructor for tag found.');
	};

	// Storage for external functions which are executed when
	// an element is created
	EPE.PlugIn.create = {};

	// Storage for external functions which are executed when
	// a property of an element is changed
	EPE.PlugIn.change = {};

	// Storage for external functions which are executed when
	// an alement is attached to the document
	EPE.PlugIn.attach = {};

	/**
	* Add a create or change listener.  These listeners are called from EPE.extend which
	* is called when application code invokes the init method,
	* when a new node is attached to the document in innerHTML, and from
	* document createElement.
	*
	* The event module UEM registers create listeners.
	* 
	* @param t The type of listener. Either create or change
	* @param f The event function.
	*/
	EPE.PlugIn.prototype.addEPEListener =
    function (t, f) {
    	var con = this.con.toString();
    	// If constructor doesn't exist in cache then function doesn't either
    	if (!EPE.PlugIn[t][con]) {
    		EPE.PlugIn[t][con] = [];
    		EPE.PlugIn[t][con].push(f);
    	}
    	else {
    		// Only cache if function is not cached already
    		var l = EPE.PlugIn[t][con].length;
    		for (var i = 0; i < l; i++) {
    			if (EPE.PlugIn[t][con] == f)
    				return;
    		}
    		EPE.PlugIn[t][con].push(f);
    	}
    };

	/**
	* Remove a create or change listener.
	* 
	* @param t The type of listener. Either create or change
	* @param f The event function.
	*/
	EPE.PlugIn.prototype.removeEPEListener =
      function (t, f) {
      	// If function is not registered for constructor just return
      	var con = this.con.toString();
      	if (!EPE.PlugIn[t][con])
      		return;
      	// Else find function
      	var l = EPE.PlugIn[t][con].length;
      	var n = 0;
      	for (var i = 0; i < l; i++)
      		EPE.PlugIn[t][con][i] == f ? n++ : EPE.PlugIn[t][con][i - n] = EPE.PlugIn[t][con][i];
      	EPE.PlugIn[t][con].length = EPE.PlugIn[t][con].length - n;
      	// If no functions are registered for constructor remove array 
      	if (!EPE.PlugIn[t][con].length)
      		delete EPE.PlugIn[t][con];
      };

	// Execute create listeners
	EPE.PlugIn.executeCreate =
    function (elm) {
    	var con = null;
    	if (elm.nodeName != 'APPLET' && elm.nodeName != 'OBJECT') {
    		con = elm.constructor.toString();
    	}
    	// Temp. solution for OBJECT and APPLET tags
    	else {
    		try {
    			con = elm.constructor.toString();
    		}
    		catch (ex) {
    		}
    	}
    	// Execute listeners on specific element
    	if (con != null && this.create[con]) {
    		if (elm.nodeName != 'APPLET' && elm.nodeName != 'OBJECT') {
    			for (var i = 0; i < this.create[con].length; i++)
    				this.create[con][i].apply(elm);
    		}
    		// Temp. solution for OBJECT and APPLET tags
    		else {
    			for (var i = 0; i < this.create[con].length; i++)
    				try {
    					this.create[con][i].apply(elm);
    				}
    				catch (ex) {
    				}
    		}
    	}
    	// Execute listeners on HTMLElement
    	else if (this.create['HTMLElement']) {
    		for (var i = 0; i < this.create['HTMLElement'].length; i++) {
    			if (elm.nodeName != 'APPLET' && elm.nodeName != 'OBJECT') {
    				this.create['HTMLElement'][i].apply(elm);
    			}
    			// Temp. solution for OBJECT and APPLET tags
    			else {
    				try {
    					this.create['HTMLElement'][i].apply(elm);
    				}
    				catch (ex) {
    				}
    			}
    		}
    	}
    };

	// Execute change listeners
    EPE.PlugIn.executeChange = function (elm, e) {
    	if (!elm.constructor) {
    		return;
    	}
    	var con = elm.constructor.toString();
    	// Stop property watching
    	EPE.disableWatch(elm);
    	// If element is in fact the document object
    	// Execute listeners on specific element
    	if (this.change[con]) {
    		for (var i = 0; i < this.change[con].length; i++)
    			this.change[con][i].apply(elm, [e]);
    	}
    	// Execute listeners on HTMLElement
    	else if (this.change['HTMLElement']) {
    		for (var i = 0; i < this.change['HTMLElement'].length; i++)
    			this.change['HTMLElement'][i].apply(elm, [e]);
    	}
    	// Re-enable property watching
    	EPE.enableWatch(elm);
    };

	// Execute attach listeners
	EPE.PlugIn.executeAttach =
    function (elm) {
    	var con = elm.constructor.toString();
    	// Stop property watching
    	EPE.disableWatch(elm);
    	// Execute listeners on specific element
    	if (this.attach[con]) {
    		for (var i = 0; i < this.attach[con].length; i++)
    			this.attach[con][i].apply(elm);
    	}
    	// Execute listeners on HTMLElement
    	if (this.attach['HTMLElement']) {
    		for (var i = 0; i < this.attach['HTMLElement'].length; i++)
    			this.attach['HTMLElement'][i].apply(elm);
    	}
    	// Re-enable property watching
    	EPE.enableWatch(elm);
    };

	/***********************************************
	*
	*
	*  Section 6 - Redeclaration of native JS
	*              functions/methods
	*
	***********************************************/

	/**
	* Replacement for the native appendChild method. Appends a child element
	* and arranges for the node and it's children to be prototype extended.
	* 
	* @param elm The node to append as the last of this element's children.
	*/
	EPE.appendChild =
    function (elm) {
    	EPE.extendInnerHTML(elm);
    	// Remove from cache
    	if (EPE.CACHE_ELEMENTS && elm.cached)
    		EPE.cache.remove(elm);
    	return this._appendChild(elm);
    };

	/**
	* Replacement for the native insertBefore method. Inserts a child element
	* and arranges for the node and it's children to be prototype extended.
	* 
	* @param newChild The node to insert.
	* @param refChild The child node that will be the nextChild after
	*     the insertion. 
	*/
	EPE.insertBefore =
    function (newChild, refChild) {
    	EPE.extendInnerHTML(newChild);
    	if (EPE.CACHE_ELEMENTS && newChild.cached)
    		EPE.cache.remove(newChild);
    	return this._insertBefore(newChild, refChild);
    };

	/**
	* Replacement for the native replaceChild method. Replaces a child element
	* and arranges for the node and it's children to be prototype extended.
	* 
	* @param newChild The node to insert.
	* @param refChild The child node that will be replaced after the insertion
	*     is complete.
	*/
	EPE.replaceChild =
    function (newChild, oldChild) {
    	EPE.extendInnerHTML(newChild);
    	if (EPE.CACHE_ELEMENTS && newChild.cached)
    		EPE.cache.remove(newChild);
    	return this._replaceChild(newChild, oldChild);
    };

	/**
	* Replacement for the native insertRow method for tables and tablesections.
	* Creates a row, inserts it into the table or table section   
	* and arranges for the node and it's children to be prototype extended.
	* 
	* @param i Index where the row should be inserted.
	*/
	EPE.insertRow =
    function (i) {
    	var tr = this._insertRow(i);
    	return tr ? EPE.extend(tr) : null;
    };

	/**
	* Replacement for the native insertCell method for table rows.
	* Creates a cell, inserts it into the table row   
	* and extends the cell.
	* 
	* @param i Index of the cell.
	*/
	EPE.insertCell =
    function (i) {
    	var td = this._insertCell(i);
    	return td ? EPE.extend(td) : null;
    };

	/**
	* Replacement for the native createCaption method for tables.
	* Creates a caption, inserts it into the table    
	* and extends the caption.
	* 
	*/
	EPE.createCaption =
    function () {
    	var cap = this._createCaption();
    	return cap ? EPE.extend(cap) : null;
    };

	/**
	* Replacement for the native createTHead method for tables.
	* Creates a table header section, inserts it into the table   
	* and extends the tablesection.
	* 
	*/
	EPE.createTHead =
    function () {
    	var th = this._createTHead();
    	return th ? EPE.extend(th) : null;
    };

	/**
	* Replacement for the native createTFoot method for tables.
	* Creates a table footer section, inserts it into the table   
	* and extends the tablesection.
	* 
	*/
	EPE.createTFoot =
    function () {
    	var tf = this._createTFoot();
    	return tf ? EPE.extend(tf) : null;
    };

	// If HTMLCollections are anabel by the user
	if (EPE.ENABLE_HTMLCOLLECTIONS) {
		/**
		* Replacement for the native getElementsByTagName method.
		* Creates a proper HTMLCollection which can be extended   
		* by prototyping on HTMLCollection.prototype
		* 
		* @param t The tag name.
		*/
		EPE.getElementsByTagName =
      function (t) {
      	var c = new HTMLCollection(this._getElementsByTagName(t));
      	return c;
      };
	}

	/***********************************************
	*
	*
	*  Section 7 - Prototype handling
	*
	*
	***********************************************/

	/**
	* Create a pseudo prototype object for HTML constructors.  The pseudo
	* prototype reflects the content of the original prototype.  Application
	* code that looks like it is changing the original, real prototype is
	* in reality only changing the pseudo-prototype.  There is only one instance
	* of this pseudo-prototype.  This singleton is a target of propertychange
	* events when application code attempts to alter an HTML prototype.
	* 
	* This is the first function to be called when EPE is loaded.
	* 
	* @param oCon A reference to the constructor.  This is either HTMLElement
	*             itself or a subclass of HTMLElement.
	*/
	EPE.initPrototype =
    function (oCon) {
    	// oCon is object constructor function
    	// Save real prototype.
    	oCon._prototype = oCon.prototype;
    	// Create element so we can trigger onpropertychange
    	oCon.prototype = EPE.IECreateElement('epe');
    	// Copy functions from real prototype to pseudo prototype
    	// This is done to synchronize the real and pseudo
    	// prototype objects when the pseudo object is
    	// first created. All subsequent changes will *always*
    	// be to the pseudo object and EPE.updatePrototype
    	// will be responsible for syncronizing with the
    	// real prototype.
    	for (var p in oCon._prototype)
    		oCon.prototype[p] = oCon._prototype[p];
    	// Set the constructor to point at correct function
    	oCon.prototype.constructor = oCon;
    	// Create toString method so the same is reported as in Firefox
    	oCon.toString = EPE.constructorToString;
    	// Add <epe> tag to html HEAD section - we probably do least harm here
    	document.documentElement.childNodes[0].appendChild(oCon.prototype);
    	// Listen for changes to the pseudo prototype
    	oCon.prototype.attachEvent('onpropertychange', EPE.updatePrototype);
    };

	/**
	* Called whenever our expando tag changes properties.  When a change
	* to the prototype is attempted in application code, the change is really
	* made to a pseudo-prototype.
	* 
	* If the change is for an HTMLElement, the same change is made to the real
	* and pseudo prototypes of the subclasses of HTMLElement.  Then the change
	* is propagated to all elements in the DOM hierarchy.  If caching is enabled
	* by the application code, the same change is propagated to all cached
	* elements.
	* 
	* If the change is for a proper subclass of HTMLElement, then
	* the corresponding change is propagated to the real prototype.  Then the
	* change is propagated to all elements in the DOM hierarchy that have a
	* tag name that is backed by the HTMLElement subclass.  If caching is
	* enabled by the application code, the same change is propagated to all
	* cached elements with the appropriate tag names.
	*/
	EPE.updatePrototype =
    function () {
    	// Property name in pseudo prototype object which was altered
    	var p = event.propertyName;
    	// Shortcut
    	var src = event.srcElement;
    	// Update the real prototype. The pseudo prototype is already updated
    	// - that was what caused the event to happen in the first place)
    	src.constructor._prototype[p] = src[p];
    	// If the prototype being updated is on the HTMLElement
    	// we need to propagate changes to all constructors.
    	if (src.constructor == HTMLElement) {
    		var a = EPE.uniqueTags;
    		var l = a.length;
    		// Update all real and pseudo prototypes
    		for (var i = 0; i < l; i++) {
    			// Only update/overwrite if constructor does not have a property already
    			// If p exist then a function on the prototype has been declared
    			// and a declaration on HTMLElement should not override.
    			//if (a[i]._prototype[p] == undefined) {
    			a[i]._prototype[p] = src[p];
    			// If we don't update the pseudo prototype then HTML[TAG]Element.prototype[p] will be undefined
    			// This will trigger onpropertychange so temp. remove in order to avoid endless recursion
    			a[i].prototype.detachEvent('onpropertychange', EPE.updatePrototype);
    			a[i].prototype[p] = src[p];
    			a[i].prototype.attachEvent('onpropertychange', EPE.updatePrototype);
    			//}
    		}
    		// Update all elements
    		EPE.updateAllElements(p, src[p]);
    	}
    	else {
    		// Update elements constructed from this constructor
    		var a = src.constructor.tags;
    		var l = a.length;
    		// Update elements
    		for (var i = 0; i < l; i++)
    			EPE.updateElements(a[i], p, src[p]);
    	}
    };

	/**
	*  Update all elements setting element.  First, all elements that are
	*  already in the DOM hierarchy of the current document are updated
	*  (excluding only the nodes added by initPrototype to catch propertychange
	*  events triggered by prototype changes).  Then, if the application code
	*  has enabled element caching, elements that have been stored in the
	*  cache and that have not yet been attached to the DOM hierarchy are
	*  updated.
	*  
	*  @param p Property name.
	*  @param v Property value.
	*/
	EPE.updateAllElements = function (p, v) {
    	var elms = document.all;
    	// This loop causes all elements to fire onpropertychange
    	// Changes to the prototype is an intricate part of EPE
    	// and should not be communicated to other scripts
    	var l = elms.length;
    	for (var i = 0; i < l; i++) {
    		if (elms[i].tagName != '!' && elms[i].tagName != 'epe') {
    			EPE.disableWatch(elms[i]);
				try {
    				elms[i][p] = v;
    			} catch (e) {
					// Just in case?
				}
    			EPE.enableWatch(elms[i]);
    		}
    	}
    };

	/**
	* Update all elements with a given tagname.  The elements are altered by
	* setting the value of a given property.
	* 
	* The update is done in two steps.  First, all instances of the tag that
	* are in the DOM hierarchy of the current document are updated.  Then, if
	* the application code has enabled element caching, elements that have been
	* stored in the cache and that have not yet been attached to the DOM
	* hierarchy are updated.
	* 
	* @param tag {String} An HTML tag name.
	* @param p {String}   The name of the property.
	* @param v The value of the property.
	*/
	EPE.updateElements =
    function (tag, p, v) {
    	// Get specific elements in document
    	var elms = document.getElementsByTagName(tag);
    	// This loop causes all elements of type tag to fire onpropertychange
    	// Changes to the prototype is an intricate part of EPE
    	// and should not be communicated to other scripts
    	var l = elms.length;
    	for (var i = 0; i < l; i++) {
    		EPE.disableWatch(elms[i]);
    		elms[i][p] = v;
    		EPE.enableWatch(elms[i]);
    	}
    };

	/***********************************************
	*
	*
	*  Section 8 - Element constructor declarations
	*
	*
	***********************************************/

	// Tag to constructor name table
	EPE.tags = {
		a: HTMLAnchorElement,
		applet: HTMLAppletElement,
		area: HTMLAreaElement,
		base: HTMLBaseElement,
		basefont: HTMLBaseFontElement,
		body: HTMLBodyElement,
		br: HTMLBRElement,
		button: HTMLButtonElement,
		caption: HTMLTableCaptionElement,
		col: HTMLTableColElement,
		colgroup: HTMLTableColElement,
		del: HTMLModElement,
		dir: HTMLDirectoryElement,
		div: HTMLDivElement,
		dl: HTMLDListElement,
		em: HTMLSpanElement,  // Firefox extension.
		fieldset: HTMLFieldSetElement,
		font: HTMLFontElement,
		form: HTMLFormElement,
		frame: HTMLFrameElement,
		frameset: HTMLFrameSetElement,
		h1: HTMLHeadingElement,
		h2: HTMLHeadingElement,
		h3: HTMLHeadingElement,
		h4: HTMLHeadingElement,
		h5: HTMLHeadingElement,
		h6: HTMLHeadingElement,
		head: HTMLHeadElement,
		hr: HTMLHRElement,
		html: HTMLHtmlElement,
		iframe: HTMLIFrameElement,
		img: HTMLImageElement,
		input: HTMLInputElement,
		ins: HTMLModElement,
		isindex: HTMLIsIndexElement,
		label: HTMLLabelElement,
		legend: HTMLLegendElement,
		li: HTMLLIElement,
		link: HTMLLinkElement,
		map: HTMLMapElement,
		menu: HTMLMenuElement,
		meta: HTMLMetaElement,
		object: HTMLObjectElement,
		ol: HTMLOListElement,
		optgroup: HTMLOptGroupElement,
		option: HTMLOptionElement,
		p: HTMLParagraphElement,
		param: HTMLParamElement,
		pre: HTMLPreElement,
		q: HTMLQuoteElement,
		select: HTMLSelectElement,
		script: HTMLScriptElement,
		span: HTMLSpanElement,  // Firefox extension.
		strike: HTMLSpanElement,  // Firefox extension.
		strong: HTMLSpanElement,  // Firefox extension.
		style: HTMLStyleElement,
		table: HTMLTableElement,
		tbody: HTMLTableSectionElement,
		td: HTMLTableCellElement,
		textarea: HTMLTextAreaElement,
		tfoot: HTMLTableSectionElement,
		th: HTMLTableCellElement,
		thead: HTMLTableSectionElement,
		title: HTMLTitleElement,
		tr: HTMLTableRowElement,
		ul: HTMLUListElement
	};

	// Create array of unique constructors
	EPE.uniqueTags = [];
	for (var p in EPE.tags)
		EPE.uniqueTags.push(EPE.tags[p]);
	var a = [];
	var l = EPE.uniqueTags.length;
	for (var i = 0; i < l; i++) {
		for (var j = i + 1; j < l; j++) {
			// If this[i] is found later in the array
			if (EPE.uniqueTags[i] == EPE.uniqueTags[j])
				j = ++i;
		}
		a.push(EPE.uniqueTags[i]);
	}
	EPE.uniqueTags = a;

	// IE conditional comments have to be used to hide the function declarations
	// below from Safari and Opera. This is due to Sarafi and Opeara following
	// the ECMA 262 spec on conditional function declarations. Firefox deviates
	// from the spec but might correct it in the future.
	// The conditional comments renders the jsdoc comments useless so they have
	// been changed to inline comments

	// HTMLDocument. Just a placeholder - not meant to be instantiated
	// @constructor

	/*@cc_on
	function HTMLDocument() { }
	document.constructor = HTMLDocument;
	HTMLDocument.toString = EPE.constructorToString;

	// HTMLElement.  The other elements inherit from this object.
	// @param t {String} A tag name.
	// @constructor
	function HTMLElement(t) {
		if (t) {
			var elm = EPE.IECreateElement(t);
			EPE.extend(elm, arguments.callee);
			return elm;
		}
	}
	HTMLElement.tags = ['all'];

	//  A (anchor) tag.
	//  @constructor
	function HTMLAnchorElement() {
		var elm = EPE.IECreateElement('a');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLAnchorElement.tags = ['a'];


	//  APPLET tag.
	//  @constructor
	function HTMLAppletElement() {
		var elm = EPE.IECreateElement('applet');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLAppletElement.tags = ['applet'];

	// AREA tag.
	// @constructor
	function HTMLAreaElement() {
		var elm = EPE.IECreateElement('area');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLAreaElement.tags = ['area'];

	// BASE tag.
	function HTMLBaseElement() {
		var elm = EPE.IECreateElement('base');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLBaseElement.tags = ['base'];

	// BASEFONT tag.
	// @constructor
	function HTMLBaseFontElement() {
		var elm = EPE.IECreateElement('basefont');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLBaseFontElement.tags = ['basefont'];

	//  BODY tag.
	//  @constructor
	function HTMLBodyElement() {
		var elm = EPE.IECreateElement('body');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLBodyElement.tags = ['body'];

	// BR tag.
	// @constructor
	function HTMLBRElement() {
		var elm = EPE.IECreateElement('br');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLBRElement.tags = ['br'];

	// BUTTON tag.
	// @constructor
	function HTMLButtonElement() {
		var elm = EPE.IECreateElement('button');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLButtonElement.tags = ['button'];

	// CAPTION tag.
	// @constructor
	function HTMLTableCaptionElement() {
		var elm = EPE.IECreateElement('caption');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLTableCaptionElement.tags = ['caption'];

	// COL, COLGROUP tag.
	// @constructor
	function HTMLTableColElement(tag) {
		var elm = EPE.IECreateElement(tag);
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLTableColElement.tags = ['col', 'colgroup'];

	// DIR tag.
	// @constructor
	function HTMLDirectoryElement() {
		var elm = EPE.IECreateElement('dir');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLDirectoryElement.tags = ['dir'];

	// DIV tag.
	// @constructor
	function HTMLDivElement() {
		var elm = EPE.IECreateElement('div');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLDivElement.tags = ['div'];

	// DL tag.
	// @constructor
	function HTMLDListElement() {
		var elm = EPE.IECreateElement('dl');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLDListElement.tags = ['dl'];

	// FIELDSET tag.
	// @constructor
	function HTMLFieldSetElement() {
		var elm = EPE.IECreateElement('fieldset');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLFieldSetElement.tags = ['fieldset'];

	// FONT tag.
	// @constructor
	function HTMLFontElement() {
		var elm = EPE.IECreateElement('font');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLFontElement.tags = ['font'];

	// FORM tag.
	// @constructor
	function HTMLFormElement() {
		var elm = EPE.IECreateElement('form');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLFormElement.tags = ['form'];


	// FRAME tag.
	// @constructor
	function HTMLFrameElement() {
		var elm = EPE.IECreateElement('frame');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLFrameElement.tags = ['frame'];

	// FRAMESET tag.
	// @constructor
	function HTMLFrameSetElement() {
		var elm = EPE.IECreateElement('frameset');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLFrameSetElement.tags = ['framset'];

	// H1, H2, H3, H4, H5, H6 tag.
	// @param t {String} A tag name.  One of 'h1', 'h2', 'h3', 'h4', 'h5', or 'h6'.
	// @constructor
	function HTMLHeadingElement(t) {
		var elm = EPE.IECreateElement(t);
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLHeadingElement.tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

	// HEAD tag.
	// @constructor
	function HTMLHeadElement() {
		var elm = EPE.IECreateElement('head');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLHeadElement.tags = ['head'];

	// HR tag.
	// @constructor
	function HTMLHRElement() {
		var elm = EPE.IECreateElement('hr');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLHRElement.tags = ['hr'];

	// HTML tag.
	// @constructor
	function HTMLHtmlElement() {
		var elm = EPE.IECreateElement('html');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLHtmlElement.tags = ['html'];

	// IFRAME tag.
	// @constructor
	function HTMLIFrameElement() {
		var elm = EPE.IECreateElement('iframe');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLIFrameElement.tags = ['iframe'];

	// IMG tag.
	// @constructor
	function HTMLImageElement() {
		var elm = EPE.IECreateElement('img');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLImageElement.tags = ['img'];

	// INPUT tag.
	// @constructor
	function HTMLInputElement() {
		var elm = EPE.IECreateElement('input');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLInputElement.tags = ['input'];

	// DEL, INS tag.
	// @param t {String} A tag name.  One of 'del' or 'ins'.
	// @constructor
	function HTMLModElement(t) {
		var elm = EPE.IECreateElement(t);
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLModElement.tags = ['del', 'ins'];

	// ISINDEX tag.
	// @constructor
	function HTMLIsIndexElement() {
		var elm = EPE.IECreateElement('isindex');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLIsIndexElement.tags = ['isindex'];

	// LABEL tag.
	// @constructor
	function HTMLLabelElement() {
		var elm = EPE.IECreateElement('label');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLLabelElement.tags = ['label'];

	// LEGEND tag.
	// @constructor
	function HTMLLegendElement() {
		var elm = EPE.IECreateElement('legend');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLLegendElement.tags = ['legend'];

	// LI tag.
	// @constructor
	function HTMLLIElement() {
		var elm = EPE.IECreateElement('li');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLLIElement.tags = ['li'];

	// LINK tag.
	// @constructor
	function HTMLLinkElement() {
		var elm = EPE.IECreateElement('link');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLLinkElement.tags = ['link'];

	// MAP tag.
	// @constructor
	function HTMLMapElement() {
		var elm = EPE.IECreateElement('map');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLMapElement.tags = ['map'];

	// MENU tag.
	// @constructor
	function HTMLMenuElement() {
		var elm = EPE.IECreateElement('menu');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLMenuElement.tags = ['menu'];

	// META tag.
	// @constructor
	function HTMLMetaElement() {
		var elm = EPE.IECreateElement('meta');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLMetaElement.tags = ['meta'];

	// OBJECT tag.
	// @constructor
	function HTMLObjectElement() {
		var elm = EPE.IECreateElement('object');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLObjectElement.tags = ['object'];

	// OL tag.
	// @constructor
	function HTMLOListElement() {
		var elm = EPE.IECreateElement('ol');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLOListElement.tags = ['ol'];

	// OPTGROUP tag.
	// @constructor
	function HTMLOptGroupElement() {
		var elm = EPE.IECreateElement('optgroup');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLOptGroupElement.tags = ['optgroup'];

	// OPTION tag.
	// @constructor
	function HTMLOptionElement() {
		var elm = EPE.IECreateElement('option');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLOptionElement.tags = ['option'];

	// P tag.
	// @constructor
	function HTMLParagraphElement() {
		var elm = EPE.IECreateElement('p');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLParagraphElement.tags = ['p'];

	// PARAM tag.
	// @constructor
	function HTMLParamElement() {
		var elm = EPE.IECreateElement('param');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLParamElement.tags = ['param'];

	// PRE tag.
	// @constructor
	function HTMLPreElement() {
		var elm = EPE.IECreateElement('pre');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLPreElement.tags = ['pre'];

	// Q tag.
	// @constructor
	function HTMLQuoteElement() {
		var elm = EPE.IECreateElement('q');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLQuoteElement.tags = ['q'];

	// SELECT tag.
	// @constructor
	function HTMLSelectElement() {
		var elm = EPE.IECreateElement('select');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLSelectElement.tags = ['select'];

	// SCRIPT tag.
	// @constructor
	function HTMLScriptElement() {
		var elm = EPE.IECreateElement('script');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLScriptElement.tags = ['script'];

	// EM, SPAN, STRONG tag.  This is not a W3C class.
	// @param t {String} A tag name.  One of 'em', 'span', or 'strong'.
	// @constructor
	function HTMLSpanElement(t) {
		var elm = EPE.IECreateElement(t);
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLSpanElement.tags = ['em', 'span', 'strike', 'strong'];

	// STYLE tag.
	// @constructor
	function HTMLStyleElement() {
		var elm = EPE.IECreateElement('style');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLStyleElement.tags = ['style'];

	// TABLE tag.
	// @constructor
	function HTMLTableElement() {
		var elm = EPE.IECreateElement('table');
		EPE.extend(elm, arguments.callee);
		// Save ref. to original methodd
		elm._createTCaption = elm.createTCaption;
		elm._createTHead = elm.createTHead;
		elm._createTFoot = elm.createTFoot;
		elm._insertRow = elm.insertRow;
		// Replace with EPE version
		elm.createTCaption = EPE.createTCaption;
		elm.createTHead = EPE.createTHead;
		elm.createTFoot = EPE.createTFoot;
		elm.insertRow = EPE.insertRow;
		return elm;
	}
	HTMLTableElement.tags = ['table'];

	// TBODY, TFOOT, THEAD tag.
	// @param t {String} A tag name.  One of 'tbody', 'tfoot', or 'thead'.
	// @constructor
	function HTMLTableSectionElement(t) {
		var elm = EPE.IECreateElement(t);
		EPE.extend(elm, arguments.callee);
		// Save ref. to original method
		elm._insertRow = elm.insertRow;
		// Replace with EPE version
		elm.insertRow = EPE.insertRow;
		return elm;
	}
	HTMLTableSectionElement.tags = ['tbody', 'tfoot', 'thead'];

	// TD, TH tag.
	// @param t {String} A tag name.  One of 'tr' or 'th'.
	// @constructor
	function HTMLTableCellElement(t) {
		var elm = EPE.IECreateElement(t);
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLTableCellElement.tags = ['td', 'th'];

	// TEXTAREA tag.
	// @constructor
	function HTMLTextAreaElement() {
		var elm = EPE.IECreateElement('textarea');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLTextAreaElement.tags = ['textarea'];

	// TITLE tag.
	// @constructor
	function HTMLTitleElement() {
		var elm = EPE.IECreateElement('title');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLTitleElement.tags = ['title'];

	// TR tag.
	// @constructor
	function HTMLTableRowElement() {
		var elm = EPE.IECreateElement('tr');
		EPE.extend(elm, arguments.callee);
		// Save ref. to original method
		elm._insertCell = elm.insertCell;
		// Replace with EPE version
		elm.insertCell = EPE.insertCell;
		return elm;
	}
	HTMLTableRowElement.tags = ['tr'];

	// UL tag.
	// @constructor
	function HTMLUListElement() {
		var elm = EPE.IECreateElement('ul');
		EPE.extend(elm, arguments.callee);
		return elm;
	}
	HTMLUListElement.tags = ['ul'];
	@*/

	// Create pseudo prototype object on all HTML constructors
	EPE.initPrototype(HTMLElement);
	var a = EPE.uniqueTags;
	var l = a.length;
	for (var i = 0; i < l; i++)
		EPE.initPrototype(a[i]);
}