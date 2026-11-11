# Browser-to-Database Request Flow

## Assignment

Draw the full request path from the browser to the database and back.
Mark where TLS can be terminated and where responses can be cached.

## 1. Complete Request Flow

``` text
                         USER
                           |
                           v
                    +-------------+
                    |   BROWSER   |
                    +-------------+
                           |
                           | 1. DNS lookup
                           v
                    +-------------+
                    |     DNS     |
                    | Domain -> IP|
                    +-------------+
                           |
                           | 2. Connect using TCP + HTTPS
                           v
                    +-------------+
                    |  CDN / WAF  |
                    | Cache check |
                    +-------------+
                           |
                           v
                    +-------------+
                    | LOAD        |
                    | BALANCER    |
                    +-------------+
                           |
                           v
                    +-------------+
                    | NGINX       |
                    | Reverse     |
                    | Proxy       |
                    |             |
                    | TLS         |
                    | TERMINATION|
                    +-------------+
                           |
                           | HTTP over private network
                           v
                    +-------------+
                    | Node.js /   |
                    | Express API |
                    +-------------+
                           |
                           v
                    +-------------+
                    | Redis Cache |
                    +-------------+
                           |
                      Cache miss
                           |
                           v
                    +-------------+
                    | PostgreSQL  |
                    | Database    |
                    +-------------+

Response: Database -> Node.js -> Nginx -> Load Balancer -> CDN -> Browser
```

## 2. Explain the Flow

1.  **Browser:** The user opens the website or sends an API request.
2.  **DNS:** DNS finds the IP address for the domain name.
3.  **TCP + TLS:** The browser establishes a network connection and uses
    HTTPS to protect communication.
4.  **CDN / WAF:** The CDN may return cached content. The WAF checks
    requests for suspicious traffic.
5.  **Load Balancer:** It distributes incoming requests across available
    servers.
6.  **Nginx:** Nginx acts as a reverse proxy and forwards the request to
    the backend.
7.  **Node.js / Express:** The backend validates and processes the
    request.
8.  **Redis:** The application checks whether the requested data is
    already cached.
9.  **PostgreSQL:** If Redis has no cached data (cache miss), the
    application queries the database.
10. **Response:** The backend sends the result back through the relevant
    network layers. The browser receives the response and displays the
    data.

## 3. TLS Termination

In this example, TLS terminates at Nginx.

``` text
BROWSER
   |
   | HTTPS (encrypted)
   v
NGINX  <-- TLS TERMINATION: decrypts the HTTPS traffic
   |
   | HTTP (private network, not encrypted)
   v
NODE.JS
```

TLS termination means the HTTPS/TLS connection ends at a component, and
that component decrypts the traffic so it can forward the request.

Here, Nginx handles the browser's HTTPS connection and sends the request
to Node.js over HTTP on a private network.

TLS can also terminate at a CDN, Load Balancer, Nginx, or directly at
the application server. The exact location depends on the architecture.

**Security note:** If the connection from Nginx to Node.js must also be
encrypted, configure HTTPS for that internal connection. Nginx then
terminates the first TLS connection and establishes a second TLS
connection to Node.js. This is called TLS re-encryption.

## 4. Where Can Responses Be Cached?

  Layer                   What can be cached
  ----------------------- -------------------------------------------------
  Browser                 Images, CSS, JavaScript and permitted responses
  CDN                     Static files and cacheable HTTP responses
  Nginx / Reverse Proxy   Responses configured for proxy caching
  Redis                   Frequently requested application data

-   **Cache hit:** The requested data is already in the cache, so it can
    be returned without fetching it from the next layer.
-   **Cache miss:** The data is not in the cache, so the application
    fetches it from the next source, such as the database. It may then
    store the result in Redis.

Do not cache every response automatically. User-specific or sensitive
data needs careful cache rules.

## 5. Pipeline Flow:

First, the user sends a request from the browser.

The browser uses DNS to find the server's IP address. Then it
establishes a connection using TCP and secures the communication with
TLS.

The request reaches the CDN and WAF. The CDN can serve cached content,
while the WAF helps filter suspicious requests.

Next, the Load Balancer distributes traffic, and Nginx acts as a reverse
proxy.

In this example, TLS terminates at Nginx. Nginx decrypts the HTTPS
request and forwards it to the Node.js application over a private HTTP
connection.

The Node.js application processes the request and checks Redis for
cached data. If the data is available, Redis returns it. Otherwise, the
application fetches it from PostgreSQL and may store it in Redis for
future requests.

Finally, the backend sends the response back through the relevant
network layers to the browser, where the result is displayed to the
user.

**Remember the flow:**

`Browser -> DNS -> TCP/TLS -> CDN/WAF -> Load Balancer -> Nginx -> Node.js -> Redis -> PostgreSQL`

`Response: PostgreSQL -> Node.js -> Nginx -> Load Balancer -> CDN -> Browser`
