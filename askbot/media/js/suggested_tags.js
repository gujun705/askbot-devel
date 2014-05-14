/**
 * This class is used to fetch and display suggested tags according to 
 * category user selected when asking or editing questions.
 *
 **/
var SuggestedTags = function(maxTags) {
	this.container = document.getElementById('suggestedTags');
	if (!this.container) return;

	this.cache = {};

	this.maxTags = maxTags || 5; // the default value is 5

	var _this = this;
	
	this.registerCategoryEvent(function selectionHandler(sel) {
		_this.fetchTags(sel, function(tags) {
			_this.showTags(tags);
		});
	});
	
	var catSel = this.getCategorySelector();
	catSel.onchange();
};

SuggestedTags.prototype = {
getCategorySelector: function() {
	// id = category when asking question
	// id = id_category when editing question
	return document.getElementById('category') || document.getElementById('id_category');
},

registerCategoryEvent: function(callback) {
	var catSel = this.getCategorySelector();
	catSel.onchange = function() {
		if (this.selectedIndex == 0) return;
		var sel = this.options[this.selectedIndex].text;
		callback(sel);
	};
},

fetchTags: function(sel, onSuccess, onFail) {
	var _this = this,
		// encodedSel = encodeURIComponent(sel),
		cachedTags = this.getCachedTags(sel);
	if (cachedTags) {
		if (typeof onSuccess != 'function') return;
		onSuccess(cachedTags);
		return;
	}
	$.ajax({
		url: this.getUrl(), 
		data: {category: sel}
	}).done(function(data) {
		if (typeof onSuccess != 'function') return;
		_this.cacheTags(sel, data);
		onSuccess(data);
	}).fail(function(jqXHR, textStatus, errorThrown) {
		if (typeof onFail != 'function') return;
		onFail(jqXHR, textStatus, errorThrown);
	});
},

getCachedTags: function(sel) {
	return this.cache[sel]
},

cacheTags: function(sel, tags) {
	this.cache[sel] = tags;
},

getUrl: function() {
	return '/get-suggested-tags/';
},

showTags: function(tags) {
	if (tags == null || tags.length == 0) {
		this.container.innerHTML = '';
		return;
	}
	var _this = this,
		input = document.getElementById('id_tags'),
		i = 0,
		len = tags.length,
		tag;
	this.container.innerHTML = '<strong>Suggested tags:</strong><span id="suggested_tags_error" class="form-error"></span><br/>';
	for (; i < len; i++) {
		tag = document.createElement('span');
		tag.className = 'category-suggested-tags tag-right';
		// tag.innerHTML = tags[i];
		tag.innerText = tags[i];
		tag.onclick = function() {
			var inputValue = input.value.replace(/^\s*/, '').replace(/\s*$/, ''),
				inputTags = inputValue.split(/\s+/),
				j = 0,
				length = inputTags.length,
				tagValue = this.innerText;
			if (length >= _this.maxTags) {
				onError('Cannot add more tags, please use 5 tags or less.');
				return false;
			}
			for (; j < length; j++)
				if (tagValue == inputTags[j]) {
					onError('Please do not add duplicate tags.');
					return false;
				}
			input.value = inputValue == '' ? tagValue : (inputValue + ' ' + tagValue);
			return false;
		};
		_this.container.appendChild(tag);
	}
	
	function onError(msg) {
		if (_this.preventAnimation) return false;
		_this.preventAnimation = true;
		var errorSpan = document.getElementById('suggested_tags_error');
		errorSpan.innerText = msg;
		setTimeout(function() {
			$(errorSpan).animate({opacity: 0}, 400, 'linear', function() {
				errorSpan.innerText = '';
				errorSpan.style.opacity = 1;
				_this.preventAnimation = false;
			});
		}, 1500);
	}
},

};
