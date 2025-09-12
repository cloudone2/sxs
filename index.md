---
layout: default
title: Home
---

<div class="home">
  <h1 class="page-heading">All Blog Posts</h1>

  <div class="post-list">
    {% for item in site.season %}
  <div class="post-item">
    <h2>
      <a class="post-link" href="{{ item.url | relative_url }}">
        {{ item.title }}
      </a>
    </h2>
    <!-- rest of your post display code -->
  </div>
{% endfor %}
  </div>

  <!-- Optional: Add pagination if you have many posts -->
  <!-- {% include pagination.html %} -->
</div>