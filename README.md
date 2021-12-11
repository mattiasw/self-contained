# Self-contained web page data URI generator

Create a web page contained inside a link that can be sent to others. No hosting
needed.

## How does it work?

In addition to regular URLs like http://example.com, web browsers can also use
something called a data URI. A data URI looks like this:

```
data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7
```

That is a transparent GIF image. The most common uses of data URIs are probably
images or as a way to encode files for client-side-only use.

But there is nothing stopping us from putting a whole web page in that link. We
just need to make sure we don't reference any local files. External files are
okay though which makes it possible to still create pretty advanced pages.
