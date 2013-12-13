Stylefill.js
============

A ‘Stylefill’ is a way to create new CSS properties using JavaScript. Stylefills are similar in concept to a [polyfill](http://remysharp.com/2010/10/08/what-is-a-polyfill/), but are only focussed on extending CSS in new ways, and Stylefill.js is a library to help make it much easier.

*Disclaimer: This is for people who really know JavaScript. This script will not make anything magically work.*

This script acts as a bridge between your CSS and your JavaScript, allowing your scripts to read your invented CSS properties and then run whatever function using the assigned selector and property value.

## Use cases

* Create new properties for CSS and use them in your CSS files.
* Create polyfills for older browsers that do not require much JavaScript knowledge.
* Detect CSS property support.

## Setup

Add stylefill.js to your HTML page, wherever you like. Then, you merely need to initialize stylefill, passing it the new property name and the function you want to run on that property. It’s best to add this at the end of your page, just before the closing `body` tag.

```HTML
	<script type="text/javascript">
	
		stylefill.init({
		
			'new-property-name' : function-name
		
		});
	
	</script>
		
</body>
</html>
```

In your own javascript, you then create a function that will handle this property. Stylefill.js will parse your CSS and return an array of rule object consisting of three variables to your function:
* __Selector__ - The selector used for the CSS rule.
* __Property__ - The invented property name you set.
* __Value__ - The value given for your property.

This allows you, or anyone working on this CSS, to now write your new CSS properties as if they were real.

```CSS
header h1 {
	new-property-name: value; /* A brand new property! */
	font-size: 3em;
}
```

From there, the sky is your pie. Use the selector to match elements with whatever method you like – use jQuery if you must. Then run through your matched elements and alter them how you like, based on the values you define for your new rules.

## Example

_[View the demo here](http://nathanford.github.io/stylefill/demo.html)_

In __demo.html__ you will see an example of how this works. For my example, I have created new property to handle ragged edges in typography. I have named the property `rag-adjust`, and initialize it with Stylefill at the bottom of the HTML.

```HTML

	…

	<script src="./js/stylefill.js" type="text/javascript"></script>
	<script src="./js/typography.js" type="text/javascript"></script>
	
	<script type="text/javascript">
	
		stylefill.init({
		
			'rag-adjust' : typo.ragadjust
		
		});
	
	</script>
		
</body>
</html>
```

I have placed my function in the file typography.js, in which I can build my library of new CSS + JS functions. In the `typo.ragadjust` function, I use the first few lines to loop through the rules from my CSS find the elements that match the selector I defined there:

```HTML
for (i in rules) {

	var rule = rules[i],
			eles = document.querySelectorAll(rule.selector),
			
```

Here, `rule.selector` comes straight from my CSS, as I wrote it there. Later, I use the values from my CSS (`rule.value`) to decide how to manipulate the elements:

```HTML
if (rule.value == 'small-words' || rule.value == 'all') 
	
	// replace small words
	elehtml = elehtml.replace(smallwords, function(contents, p1, p2) {
      return p1 + p2.replace(/\s/g, '&nbsp;');
  });
			
```

Now, in my CSS, I can write:

```CSS
p, li, h3, dd {
	max-width: 32em;
	rag-adjust: all; /* My new property */
}
```

…and it will be handled just as if it was a real CSS property.

### Future proofing
Stylefill.js will check to see if a new property is valid before running your script. If something you’ve built eventually finds its way into the spec, the script will only work as a backup polyfill.

## Issues 

__Version 1.2__
* Works with rules in `style` tags and in linked stylesheets from the same domain. This will fail with rules from a stylesheet on another domain (no cross-domain, basically). Will not read inline styles either.