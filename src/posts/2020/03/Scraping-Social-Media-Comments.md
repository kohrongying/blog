---
title: Scraping Social Media Comments
date: 2020-03-13 14:56:09
tags:
- scraping
---

Scraping Facebook and Instagram comments is not an uncommon thing - especially for social media companies.<!-- excerpt --> Ever since Facebook acquired Instagram, you can now query for comments, insights etc from the Graph API, with the right endpoints.

## Facebook Comments

There are three easy steps: 

#### 1. Get an access token
You have to be a page admin/editor of the post and generate one with the [correct permissions](https://developers.facebook.com/docs/facebook-login/access-tokens/).

Get your access token in the [Graph API Explorer](https://developers.facebook.com/tools/explorer/) and extend the validity of it in the [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) to up to 2 months / 60 days.

#### 2. Find the Facebook post ID 
Get the correct URL by clicking on the timestamp of the post (eg 3 hrs ago, or March 7 - usually found underneath the author's name)

Wrong URL
- https://www.facebook.com/sgag.sg/photos/a.378177495530578/3417377514943879/?type=3&theater

Correct 
- https://www.facebook.com/sgag.sg/posts/3417379501610347

The post ID is then the last digits in the URL: `3417379501610347`

#### 3. Get comments endpoint
Endpoint:
```
https://graph.facebook.com/v5.0/{postId}/comments?
fields=comment_count,like_count,created_time,message,permalink_url&summary=1&access_token={FBTOKEN}
```
The fields are added as I thought they were helpful.

#### 4. Paginate
Check if an after is included under paging > cursors > after.
Here's a short code snippet written in js

```js
let response;
try {
  const url = `https://graph.facebook.com/v5.0/${postId}/comments?fields=comment_count,like_count,created_time,message,permalink_url&summary=1&access_token=${process.env.FBTOKEN}`;
  response = await axios.get(url);
  let data = response.data.data;
  while (response.data.data.length !== 0) {
    response = await axios.get(url + "&after=" + response.data.paging.cursors.after);
    data = [...data, ...response.data.data];
  }
  // USE data
} catch (error) {
  console.log(error.response);
}
```

Yay! No external libraries, just graph API with a token that expires in 60 days ¯\\\_(ツ)_/¯

## Instagram Comments

The process to getting instagram post comments with Graph API is very similar. The only problem was that I spent too much time finding the post ID. 

We regularly see the instagram url for posts all end with a 11 digit shortcode eg: `https://www.instagram.com/p/B9qN5JFhfWz/`. My first idea was to find a way to convert the shortcode `B9qN5JFhfWz` into a numeric ID. A simple google search lead me to [this article](https://carrot.is/coding/instagram-ids.html). 

Problem is the 19-digit ID decoded from the shortcode `B9qN5JFhfWz` was not the post id! 

(assuming access token is acquired with the instagram basic permission)
#### 1. Getting Instagram User ID
On [Graph API Explorer](https://developers.facebook.com/tools/explorer/) find the `ig-user-id`
`/{fb-page-name}?fields=instagram_business_account`

#### 2. Getting Instagram Media
On [Graph API Explorer](https://developers.facebook.com/tools/explorer/) find the list of media:
`/{ig-user-id}/media`

TADA! This will return a list of facebook post-id for those instagram posts.

For extra clarity, do this:
`/{ig-user-id}/media?fields=ig_id,shortcode`

```
{
  "data": [
    {
      "ig_id": "2263774239079764498",
      "shortcode": "B9qiq0sB5IS",
      "id": "17870822104623583"
    },
    {
      "ig_id": "2263727042707413494",
      "shortcode": "B9qX8BpBVn2",
      "id": "17953709776315597"
    },
    {
      "ig_id": "2263682864078255539",
      "shortcode": "B9qN5JFhfWz",
      "id": "17859657886776538"
    }
  ]
}
```
The `id` is the post-id given by Facebook which will return the comments. The `ig_id` is the 19-digit that can potentially be decoded from the 11-digit shortcode. It took me hours to understand how my base64 conversion of a 11-digit shortcode could lead to a 17-digit id.

The lesson learnt was not to question myself and to think of the problem rationally, step-by-step. The shortcode is made of 0-9a-Z-_ (which is obviously base64). That part was correct. 

I reached my epiphany when I queried `https://api.instagram.com/oembed?url=http://instagr.am/p/B9qN5JFhfWz/`.

```
{
  "version": "1.0",
  "media_id": "2263682864078255539_293188374",
  ...
}
```
I found out the id returned is truly my 19 digit number decoded from the shortcode. AHA!

I suddenly understood that even though fb acquired ig, the ig-id is not used by fb. Fb has formulated a new id to each ig post.

The only way to query ig comments based on an ig url, is to query for all media, with the shortcode field, and match it to the post id based on the query.

¯\\\_(ツ)_/¯

A painful lesson nonetheless hahaha.