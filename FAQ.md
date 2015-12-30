# Scrapbook FAQ #

1) How is this different, i already know a dozen annotation extensions?

This is supposed to be a close clone of the firefox scrapbook.  Most plugins may save offline, but not annotate [http://code.google.com/p/chrome-scrapbook/
chrome-scrapbook].
Some will annotate but not save offline(diigo).
There was no good extension for chrome that was like firefox. So i made this.

2) How do I use this?

You should follow the videos on the main [extension page](https://chrome.google.com/extensions/detail/fihabipakbgncingdhhdidlbhneeicne) to see how it works

3) How was it made

Its written in HTML5 features like webdatabases, webworkers, sandboxing etc and written in jQuery. The UI is the jsTree jQuery plugin.

4) Where are the pages saved?

In windows you can see a file in the location .

` C:\Documents and Settings\<username>\Local Settings\Application Data\Google\Chrome\User Data\Default\databases\chrome-extension_fihabipakbgncingdhhdidlbhneeicne_0 `

In Linux its typically in

`~/.config/chromium/Default/databases/chrome-extension_fihabipakbgncingdhhdidlbhneeicne_0 `

this file contains all your data. My personal favourite idea to back up this file is to link that folder/file with drop box. Or you could just copy it over to some location to keep it safe...

5) I open Pages from the scrapbook and its either  not rendering/elements  or page sections are distorted:

Most likely a Javascript is rendering the style of these pages. Generally javascript is not downloaded by the extension so bummer. That also means that there will be reduced interaction with events(like hover and clicks).
The other possibility is that the extension downloads some data from the page's server to save it, so maybe your inter net connection may have bummed out on you when you were saving the page.... In that case you can try saving and opening again...

6) I am highlighting some text but the annotation marker keeps saying "please select some text first"?

most likely the text is in an Iframe and that feature is yet to be implemented...Highlighting text in iframes is yet to be implemented. You can attach sticky notes though.

7) When I open a saved page , I see an ugly ass scroll bar inside another scroll bar, like in an iframe!!?? Should I shoot you?

Well this is embarrasing...I have tried very hard to remove them(hiding them). I am sorry.  But there is a very good reason for rendering the saved pages inside an iframe. You can read about [sandboxing](http://dev.w3.org/html5/spec-author-view/the-iframe-element.html#attr-iframe-sandbox) and how it precludes XSS. It was its necessary to make this extension work securely and the reason why no extension(AFAIK) has been able to do an annotation of pages stored locally.(Technically the extension does a document.write() inside a sandboxed iframe. with scripts disabled.)
I got an Iframe in just 1 page i tested out of a sample of 40. I believe this probability is much lower.


# Known problems/limitations #

1) Some pages wont be scrapped, The pages displayed and saved are devoid of javascripts so you may not be able to save your gmail page. This is unavoidable. But apart from Gmail I have seen this reproducing pages with 90% accuracy.

2) Iframe highlighting: text in embedded iframes will not be highlighted. This is a problem i would like to solve very much. Requires work. you can make sticky notes though.