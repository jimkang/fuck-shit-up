fuck-shit-up
==================

Adds "fuck" to sentences.

Installation
------------

    npm install fuck-shit-up

Or for command-line usage:

    [sudo] npm install -g fuck-shit-up

Usage
-----

    var fuckShitUp = createFuckShitUp();

    fuckShitUp('The rain in Spain stays mainly in the plain.', displayResult);

    function displayResult(error, result) {
      if (error) {
        console.log(error);
      }
      console.log(result);
    }

Output:

    The fucking rain in fucking Spain stays the fuck mainly in the fucking plain.

### Alternative modifiers

You can specify opts to `createFuckShitUp` to use alternative modifiers (e.g. 'goddamn', 'sodding'):

    var fuckShitUp = createFuckShitUp({
      useAlternativeModifiers: true
    });

Include vulgarities:

    var fuckShitUp = createFuckShitUp({
      useAlternativeModifiers: true,
      vulgar: true
    });

### Command line:

    fsu "The rain in Spain stays mainly in the plain."

or piped input (use dash `-`):

    echo "The rain in Spain stays mainly in the plain." | fsu -

With vulgarity:

    fsu "The rain in Spain stays mainly in the plain." --vulgar

Tests
-----

Run tests with `make test`.

License
-------

MIT.
