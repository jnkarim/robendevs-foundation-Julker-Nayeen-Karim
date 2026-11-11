# Networking Fundamentals

## 1. IP Address, Port & NAT

**Problem:** how can we identify a device and a specific application on a network?D:\Desktop\robendevs\day-01-networking\networking-fundamentals.md

**The Solution:** 
- IP Address identifies the device on the internet. (Like building address)
- Port comes to identify the application. (Like flat number)

### Public IP vs Private IP
- Public IP: Identifies a network on the public internet
- Private IP: Identifies devices inside a local network(LAN). Router connects privat devices

### NAT (Network Address Translation)

**Problem:**
Private IP addresses cannot be directly routed over the public internet. So, private devices cannot directly communicate with internet servers.

**The Solution:** 
NAT translates private IP into a Public IP of the router and maintain port mapping. This allows multiple private devices to access internet servers using one public IP. The mapping is stored into the NAT table for redirection when server responds.

---

## 2. TCP vs UDP

**Problem:** Some applications need reliable delivery, while others need faster communication with less delay.

**Solved Approach:**

**TCP:**
- Establishes a connection using a three-way handshake.
- Sends data and waits for acknowledgements.
- Retransmits lost data.
- Ensures reliable and ordered delivery.

**UDP:**
- Sends data without establishing a connection.
- Does not wait for delivery confirmation.
- Does not automatically retransmit lost data.
- Has less overhead.

---
## 4. HTTP Fundamentals

**Problem:** Browsers and servers need a standard way to exchange data.

**Solved Approach:**
HTTP (Hypertext Transfer Protocol) defines how clients send requests and servers return responses.

- HTTP follows the Client-Server model.
- It works at the Application Layer.
- A webpage is a hypertext document containing links to other resources.

### HTTP Statelessness

**Problem:** HTTP does not remember previous requests. So, how can a website remember a logged-in user?

**Solved Approach:**
Cookies and sessions help maintain user information across multiple requests.

- Browser stores a session cookie.
- It sends the cookie with later requests.
- Server uses the session ID to recognize the user.

**Note:** HTTP is stateless, but applications can maintain sessions.

--- 
## 4. HTTP Request & Response

**Problem:** The client needs to tell the server what resource it wants, and the server needs to return the result.

**Solved Approach:**
HTTP uses a request-response mechanism. The client sends an HTTP Request, and the server returns an HTTP Response.

### HTTP Request

Example:

```http
GET / HTTP/1.1
Host: developer.mozilla.org
Accept-Language: fr
```

### HTTP Response

Example:

```http
HTTP/1.1 200 OK
Content-Type: text/html
Cache-Control: public, max-age=3600

<html>
  <body>Hello World</body>
</html>
```

---

### HTTP Methods

**Problem:** The server needs to understand what action the client wants to perform on a resource.

**Solved Approach:**

| Method | Purpose |
|---|---|
| GET | Retrieve a resource |
| POST | Submit data / Create a resource |
| PUT | Replace the entire resource |
| PATCH | Update part of a resource |
| DELETE | Delete a resource |

---

### HTTP Status Codes

**Problem:** The client needs to understand whether a request was successful or failed.

**Solved Approach:**

HTTP uses status codes to communicate the result of a request.

| Range | Category | Meaning |
|---|---|---|
| 1xx | Informational | Request is being processed |
| 2xx | Success | Request successful |
| 3xx | Redirection | Further action required |
| 4xx | Client Error | Problem with the request |
| 5xx | Server Error | Problem on the server |
---
# HTTP Status Codes

Status codes tell the client what happened to its HTTP request.

## i. Status Code Categories

| Range | Category | Meaning |
|---|---|---|
| 1xx | Informational | Request is being processed |
| 2xx | Success | Request was successful |
| 3xx | Redirection | Client needs to take another action |
| 4xx | Client Error | Problem with the request |
| 5xx | Server Error | Server failed to process the request |

## ii. Common HTTP Status Codes

### 2xx: Success

| Code | Name | When to Use / Meaning |
|---|---|---|
| **200** | OK | Request successful |
| **201** | Created | A new resource was created |
| **202** | Accepted | Request accepted, but processing is not complete |
| **204** | No Content | Request successful, but no response body |

### 3xx: Redirection

| Code | Name | When to Use / Meaning |
|---|---|---|
| **301** | Moved Permanently | Resource permanently moved to a new URL |
| **302** | Found | Temporary redirection |
| **304** | Not Modified | Resource has not changed; use the cached version |

### 4xx: Client Error

| Code | Name | When to Use / Meaning |
|---|---|---|
| **400** | Bad Request | Invalid or malformed request |
| **401** | Unauthorized | Authentication is missing or invalid |
| **403** | Forbidden | Client does not have permission to access the resource |
| **404** | Not Found | Requested resource does not exist |
| **429** | Too Many Requests | Client sent too many requests in a given time |

### 5xx: Server Error

| Code | Name | When to Use / Meaning |
|---|---|---|
| **500** | Internal Server Error | Unexpected error on the server |
| **502** | Bad Gateway | Server received an invalid response from an upstream server |
| **503** | Service Unavailable | Server is temporarily unavailable |
| **504** | Gateway Timeout | Gateway did not receive a timely response from an upstream server |

---

## HTTP (Hypertext Transfer Protocol)

**Problem:**

Browsers and servers need a standard way to communicate and exchange data over the web.

**Solved Approach:**

HTTP defines how clients send requests and servers return responses.

### HTTP Versions

#### HTTP/0.9
**Problem:** Needed a simple way to retrieve webpages.

**Solved Approach:**
- Supported only GET.
- No headers or status codes.
- Returned HTML content.

#### HTTP/1.0
**Problem:** HTTP/0.9 was too limited for modern web communication.

**Solved Approach:**
- Introduced headers and status codes.
- Supported more methods and content types.
- Typically opened a new TCP connection for each request.

#### HTTP/1.1
**Problem:** Creating a new TCP connection for every request caused unnecessary overhead.

**Solved Approach:**
- **Keep-Alive:** Reuses TCP connections.
- **Pipelining:** Allows multiple requests to be sent without waiting for previous responses.
- **Host Header:** Allows multiple websites on one IP.
- **Cache-Control:** Controls response caching.

#### HTTP/2
**Problem:** HTTP/1.1 had limitations in handling multiple requests efficiently and suffered from Head-of-Line (HOL) Blocking with pipelining.

**Solved Approach:**
- **Binary Protocol:** Uses binary frames instead of text.
- **Multiplexing:** Multiple streams share one TCP connection.

**Limitation:** TCP packet loss can still block multiple streams.

#### HTTP/3
**Problem:** HTTP/2 still suffers from TCP-level Head-of-Line Blocking.

**Solved Approach:**
- Uses QUIC instead of TCP.
- Reduces connection setup delay.
- Uses TLS 1.3 for encryption.

---

