---
title: Building a Live-streaming app
date: 2019-12-06 18:15:39
tags:
- nginx
- rtmp
- live-streaming
---

We built a [live-streaming triva app](https://www.facebook.com/panikgame) from scratch and at peak, we reached 4.9K concurrent viewers for a time period of 15 minutes. 
<!-- excerpt -->

A major project that I was working on at work recently ended, hence I'd thought I'll blog about some of the learning points as they are still fresh in my head.

Think of our product as a HQ Trivia x Singapore Clone. In this post, I'll touch on the architecture we used for live streaming. 

### How we approached it
#### Figuring Requirements
1. RTMP Output (Our cross platform video player library required RTMP output)
2. Relatively cheap cost
3. Ultra Low Latency (~3-5 seconds)
4. Able to support up to 10k concurrent streams for 15-30 minutes

#### External Providers eg. Wowza
The first alternative was [Wowza](https://www.wowza.com/)

##### Pros
- Hosted on AWS
- Reliable

##### Cons
- No RTMP Output
- High latency
- Expensive

The second was [Nano Cosmo](https://www.nanocosmos.de/v6/index.html)
##### Pros
- RTMP Output

##### Cons
- Reliability (??)
- Ease of use and communication
- $3500/month

With external vendors out of the question, we looked towards self hosting our RTMP streaming servers.

#### Self Hosted
[NGINX Rtmp Module](https://github.com/arut/nginx-rtmp-module) is a GEM. Use the module alongside NGINX to create your NGINX server, out of the box. Of course, it'll require some NGINX configuration.
##### Pros
- RTMP Output
- Free / Open Source
- Customizable

##### Cons
- No assurance during downtime 
- Self maintenance

We took a leap of faith. And I was glad we landed well. :)
### Architecture

{% asset_img 'architecture.svg' 'architecture' %}
The basic artchitecture

We will use [OBS Studio](https://obsproject.com/) as input to push the stream to our RTMP Origin Server. The Edge servers will then pull the stream from the origin. Each client will then also pull from one edge server. The NGINX RTMP module can be configured as both origin and edge.

### Setting Up
Follow the set up [here.](https://github.com/arut/nginx-rtmp-module/wiki/Getting-started-with-nginx-rtmp)


Just remember to set up the name of the live application on the server end.

```
// RTMP Config in nginx.conf of SERVER
rtmp {
  server {
    listen 1935;
    application <insert-name> {
      live on;
    }
  }
}

// RTMP Config in nginx.conf of EDGE
rtmp {
  server {
    listen 1935;
    application <insert-name> {
      live on;
      max_connections 1000
      pull <origin-stream>
    }
  }
}
```

The origin-stream follows this format - `rtmp://ip-address/name/key`
Eg.`rtmp://198.169.11.02:1935/live/sEcReTK3y`
The key is something that you set from OBS.

#### Whitelisting
You would only want secure sources to be able to publish to your stream. The RTMP module allows you to [whitelist](rtmp://ip-address-of-origin/name/key) the IP that you're streaming from. This and the stream key provide a layer of security for live streaming.

#### Visual Output
We can get the [number of subscribers](https://github.com/arut/nginx-rtmp-module/wiki/Getting-number-of-subscribers) through built in methods from the module as well. 

Some extra config that had to be done.

```
cd nginx-rtmp-module-dev
cp stat.xsl /usr/local/nginx/html
```

Go to the `nginx.conf`, under http > server,
```
  location /stat {
    rtmp_stat all;
    rtmp_stat_stylesheet stat.xsl;
  }

  location /stat.xsl {
    root /usr/local/nginx/html;
  }
```

It gives a very nice site of how many people are live pulling from the server.

This served as a way for us to know how many concurrent users there were and the drop off rate over time. These numbers are used in data analytics.

We also used this information as part of our monitoring tool, as we needed to know if particulars servers were down (given by the 0 bytes transferred).

### Conclusion
Sure, it took some weeks to configure the servers to our liking but this choice was really a no brainer. My favourite part was that it was free (all we had to pay was to provision our servers on the cloud). It had just sufficient functions that were required to function. It was safe. It was cheap.

Never felt more proud to go self-hosting!


### Credits
1. [NGINX RTMP Module](https://github.com/arut/nginx-rtmp-module)
2. [Diagram.codes]() for generating the flow charts