Debouncing a function ensures that it doesn’t get called too frequently.

# example:

> [!scenario] ### Scenario
>Say you want to move a box on the page every time you scroll the browser window. Usually you start by adding some code like this:
>``` tsx
>// a simple scroll in your browser window will call this
>// fn dozens or possibly even hundreds of times
>function scrollhandler(e){
>	// do something
>}
>
>window.addEventListener('scroll', scrollHandler)
>```


> [!quote] Debouncing
> Debouncing says ==“wait until this function hasn’t been called in x time, and then run it”==. All the prior calls get dropped. Input typeaheads are another common use case. Debouncing all the ajax calls avoids causing performance issues for the server.

> [!success] implementation
> ``` tsx
> // custom debounce function
> function debounce( fn, time ) {
> 	var timer;
> 	
> 	return function( ) {
> 		// if more than one call comes in before 350ms has expired
> 		// drop the prior fn call
> 		clearTimeout(timer)
> 		
> 		// after 350ms, call the debounced fn with the original arguments
> 		// save the timeout as "timer" so we can cancel it
> 		timer = setTimeout(() => {
> 			fn.apply(this, arguments)
> 		},  time)
> 	}
> }
> 
> // very simple test case 
> function shouldFireOnlyOnce() {
> 	console.log('hello')
> }
> 
> var shouldFireOnlyOnce = debounce(shouldFireOnlyOnce, 350)
> 
> // this will quickly run 10 times. Thanks to debounce(), only the last
> // one will execute shouldFireOnlyOnce()
> for (var i=0; i<10; i++) {
> 	shouldFireOnlyOnce();
> }
> ```




