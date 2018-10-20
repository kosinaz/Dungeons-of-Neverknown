# what about now

[I'm an inline-style link](about.html)

Posts: 

{% for post in site.posts %}
[{{ post.url }}]({{ post.title }})
{% endfor %}
