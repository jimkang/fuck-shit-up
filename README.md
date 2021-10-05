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

### Custom modifiers

You can pass 'customModifiers' to `createFuckShitUp` to use modifiers of your choosing. e.g.:

    var fuckShitUp = createFuckShitUp({
      customModifiers: {
        modifiers: ['ballin\'', 'heckin\''],
        modifiersForAdverbishTargets: ['the heck', 'the most'],
        modifiersForNounTargets: ['good', 'outstanding'],
      }
    });

An instance created this way might modify 'The rain in Spain stays mainly in the plain.' into:

> The heckin' rain in good Spain stays the heck mainly in the ballin' plain.'

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
