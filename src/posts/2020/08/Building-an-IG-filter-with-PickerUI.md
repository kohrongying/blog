---
title: Created an IG filter with PickerUI!
date: 2020-08-06
tags:
- ig-filter
---

There are many text filters amongst my IG stories so I wanted to see how to recreate it.
<!-- excerpt -->

## Introducing moshimoshi

{% asset_img 'moshimoshi.jpg' 'ig filter' %}

[Try the effect](https://www.instagram.com/ar/3186471124722985/)


## Overview

This is an overview of the structure of the scene (left column of your SparkAR project)
{% asset_img 'moshi-0.png' 'setup' %}

- faceTracker0 
  * faceMesh0 with a faceMaterial with Shader Type of `Retouching` (Optional - cos you look beaut enough)
- canvas0 (background)
  * bg is a Rectangle with a bgMaterial (will cover in Adding a ColorLUT)
- main (nullObject - useful for grouping things)
  * canvas (where your rectangles will lie)
    - Rectangle. Attach a material to the rectangle. Attach a texture to the material

I chose to use images as I thought it would be less messy but there's always the option to import your font into the studio and add text. Apparently the studio doesn't support all languages. Did not try this.

## Adding the PickerUI

{% asset_img 'moshi-1.png' 'pickerui' %}

Open up the PatchEditor.
- Right click to add PickerUI
- Add the icons to the textures inside of PickerUI
- Use `Equals Exactly` and update the index 
- Output the equals module to the visibility of each rectangle
- Run refresh (leftmost column) to see

## Adding a ColorLUT

{% asset_img 'moshi-2.png' 'colorlut' %}

- Add camera texture (click on camera and under texture extraction on right side)
- Import some [ColorLUT](https://github.com/positlabs/spark-lut-patch/tree/master/textures) as textures. You can search for ones on the internet or create your own.
- Add the [FastColorLUT Patch](https://github.com/positlabs/spark-lut-patch/tree/master/patches) from positlabs
- Output the FastColorLUT Patch to the texture of the bgMaterial


## Testing your effect
There are currently two ways:
- Connect your smartphone 
- Send to your instagram

I like the second option as it is so fast and convenient!

## Upload to Facebook SparkAR Hub
The review process is rather efficient. My effect was rejected twice because of Policy 2a: about text not integrating with the background. I don't know if this helped but I used ScreenPan and ScreenRotate to allow the text to rotate, scale and transform (implementation below). I wrote in my appeal that the text was necessary and this new change allowed it to not block the background. 

Heh, just try appealing a few more times :D

## Update with ScreenPan and ScreenRotate
{% asset_img 'moshi-3.png' 'screen' %}

This [video](https://youtu.be/Xq7b5j6QrCo?t=795) was really helpful. Check it out.

## Try out the filter!
[Try the effect!](https://www.instagram.com/ar/3186471124722985/) And learn some jap!

Reach out to me via my [website](https://rongying.co/) or [twitter](https://twitter.com/RongRunBuild)!
