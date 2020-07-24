---
title: I moved to 11ty
date: 2020-07-20
tags:
- static-site
---

11ty is a static site generator that brings us back to what the web was like before JS. Just HTML and CSS.<!-- excerpt -->

## My motivations
I decided to give my blog a makeover. I was previously using [Hexo](https://hexo.io/) which is also a static site generator for blogging. It served me pretty well; I was using someone else's template and I could write and deploy it on github pages with ease.

However, my developer pride wanted me to __own__ as much of it as I could. So I looked to rebuilding my blog. There are so many options when it comes to blogging. 

### Content Management Systems (CMS)
Wordpress, Drupal etc. A lot of websites are powered by them. But as a developer, nah.

### Headless CMS 
This became rather popular in the recent years. Solutions like Prismic, Contentful, Storyblok started popping up like rabbits. They offer developers more freedom and choice that traditional CMS could not afford. However most of these solutions are priced, though a hobbyist would most possibly fit in the free tier.

Then came open source CMS-es like Ghost or Strapi. They offer even more customizations but one thing I didn't like was having to host their server on your own VPC / Digital Ocean droplet. I know it's a once off deployment for a recurring fee of ~$5 per month cheapest, but I didn't like that!

### Static Site Generators
There. are. so. many! [Gatsby](https://www.gatsbyjs.org/) and [Next.js](https://nextjs.org/) are two of the more popular choices, and I did clone some of their starter projects to try out too. However what I did not like was how bulky it felt, the many folders and configurations there was. 

Then I came across [11ty](https://www.11ty.dev/). I did not really understand what it entailed until I cloned it. And boom! I haven't yet looked back on it since.

## Eleventy

I've used Jekyll before Hexo (so this makes my third blog migration :sweat_smile:), so I could see some semblance to it. There is a main configuration file `.eleventy.js` where you would initialize plugins, shortcodes, other config details there. 

It was really simple.
 
> Input (Markdown) -> Eleventy -> Output (HTML files)

I decided to use [TailwindCSS](https://tailwindcss.com/) for styling as I found it like a breath of fresh air. And another decision I made was to not use any bundlers (eg. Webpack, Snowpack, Parcel). A wise man once said, "Why does your website need javascript to function?" Thus, I decided to host plain HTML and CSS files. Back to the good ol times. I'm not sure if that's the best decision yet and I'm sure there will also be drawbacks to not having a bundler. But it works for now.

So the next exciting part is.. making the theme! 

### Creating my own 11ty template

{% asset_img "blog.png" "blog_template" %}

I created my own [blog template](https://github.com/kohrongying/11ty-blog-starter)!!! I conclude that I'm kind of addicted to typography now as this theme is very minimal with very contrasting font weights haha. I look at my old work and I see myself growing up - there are so many distinct features in each of the new redesign.

Building a template from scratch led me to realise how many things I've taken for granted. 

For example, pagination. That in itself is a huge headache even after using helpful code blocks from 11ty.

One of the things I liked about hexo was the CLI tool `hexo new blogpost` which I tried to incorporate by writing my own script. It would save the markdown in the YY/MM folder with a pregenerated title and frontmatter. I was so excited for this.

### My template
I wanted to make sure I had some important features in my template
- Create excerpts
- A `ReadTime` filter
- A page to view all the tags and another page to show all posts related to that tag
- Shortcode to insert images
- Draft posts
- Pagination of posts
- Node script to create new post

### My only complain
Everything was going well with 11ty, Tailwind and making my template. However, I noticed that the markdown I was writing in my post looked like regular paragraphs.

This was due to Tailwind's [aggressive reset](https://tailwindcss.com/docs/preflight/) - including resetting typography elements to the same, a lot of the default markdown styles were gone. Hence, I had to use a markdown class mapper library and define a `mapping` object that contains the tailwind classes for the various markdown elements. Then include the mapping with the markdown library under eleventy's config.

```js
// .eleventy.js
const mapping = {
  h1: [
    'leading-tight',
    'border-b',
    'text-4xl',
    'font-semibold',
    'mb-4',
    'mt-6',
    'pb-2'
  ]
}

module.exports = function(eleventyConfig) {
  const md = markdownIt({ linkify: true, html: true })
  md.use(markdownItClass, mapping)
  eleventyConfig.setLibrary('md', md)
}
```

## Closing thoughts

Building the template had renewed my developer pride and ego and it gave me a renewed sense of happiness. I had also felt... Free.

Thanks for reading till here. If you're interested, check out my [blog](https://blog.rongying.co/) and my very first [11ty blog starter template](https://github.com/kohrongying/11ty-blog-starter).

Looking forward to another redesign in 1-2 years! 