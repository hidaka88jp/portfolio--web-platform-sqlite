# Message Board Spike Project

<div align="center">
  <a href="https://spike-messageboard.vercel.app/">
    <img src="https://img.shields.io/badge/VIEW_DEMO-69AB5D.svg?style=for-the-badge&logo=vercel&logoColor=white" alt="View Demo" />
  </a>
  <br><br>
  <p>
    <a href="#overview">Overview</a> •
    <a href="#what-i-learned">What I Learned</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#license">License</a>
  </p>
</div>

## About this repository
This repository is derived from portfolio--web-platform and replaces MySQL with SQLite to explore a lightweight backend setup.
MySQL version: https://github.com/hidaka88jp/portfolio--web-platform

## Overview
This application is a message board with authentication, where users can log in and post messages. A guest mode is also available, allowing the app to be explored without creating an account.

This project began as part of my frontend learning journey. While working with Next.js, especially features such as API Routes and Server Actions, I often found myself crossing into backend-related concerns. That experience made me realize that having a basic understanding of backend fundamentals would be important, even when focusing primarily on frontend development.

I studied Node.js by following a book, covering topics such as the basics of Node.js, setting up a server, using Express, connecting to a database, and working with Prisma. The learning process itself was valuable and helped establish a foundation for backend development.

However, when using Express specifically as an API, the book introduced a setup where a React project is exported and hosted from the same Express server. While this approach works for learning purposes, it felt less aligned with how modern applications are typically deployed, especially given my existing experience with Next.js deployed on Vercel.

As a result, I chose not to follow the book’s setup directly and instead tried a more realistic architecture: hosting the Next.js frontend on Vercel, and deploying the Express backend separately on Lightsail, communicating through APIs.  
This decision led the project to naturally expand into a full-stack–like experience, involving backend APIs, authentication, database integration, and server-side deployment.  
Because there was no fixed reference implementation to follow, much of the development involved encountering errors and figuring things out along the way, which ultimately became a valuable learning experience.

Through this project, I also gained hands-on experience with areas that had previously been unfamiliar to me, such as backend services, deployment servers, and reverse proxies. While I do not consider myself specialized in these areas, the experience helped me see backend and server-side components as something I can set up and work with when needed, rather than as a black box. This has been valuable for my frontend learning as well, as it gives me confidence that I can prepare a simple backend or server environment on my own when a project requires it.

### Related Repository
Frontend (Next.js): https://github.com/hidaka88jp/experiment--nextjs-with-express
  

## What I Learned
### API Design & Authentication
- Designed authentication using session tokens. I initially judged login state only by the existence of a token, but later encountered errors caused by expired tokens. Through this, I learned the importance of validating token expiration and confirming user existence in the database via a dedicated verification function.
- Learned the necessity of input validation at the API boundary to prevent invalid or unexpected data from reaching the database layer.
- Implemented password hashing to avoid storing plain text credentials.
- Learned the basic principles of XSS prevention and what responsibilities belong to the API layer.
- Understood the role of CORS and how to implement it.


### Next.js Integration & Server Actions
- Learned to handle `fetch` calls inside utility functions using `try/catch` so that network or API errors do not stop server-side rendering and cause the UI to crash.
- Learned that errors in Server Actions triggered by user input should not be handled with `throw new Error()`, but instead returned in a form that allows error messages to be displayed in the UI.
- Implemented defensive error handling in Server Actions so that failures in parsing error responses (e.g. JSON parsing errors) do not cause the entire action to fail.
- Learned the differences and appropriate use cases for `redirect()` and `router.refresh()` when working with Server Actions, and how these choices affect state management (e.g. `useActionState` vs `useState`).
- Gained a conceptual understanding of how alternative authentication methods (such as JWT or external auth providers) would interact with middleware (e.g. `proxy.ts`), even though these were not implemented in this project.


### Deployment & Infrastructure
- Learned that hiding frontend environment variables is only a secondary effect, and that in API design, URLs are public information. Rather than “hiding” endpoints, APIs should be designed to remain safe even when their URLs are known.
- Compared local backend development with running the backend inside Docker containers, and learned the trade-offs of each approach.
- Learned about issues related to `npm install --production` and Prisma, including the need for migration strategies and the concept of multi-stage builds (studied conceptually, without full optimization in this project).
- Learned how to manage environment variables across Dockerfiles and `docker-compose.yml`.
- Understood Docker networking layers, including communication within containers, Docker’s internal network, and the host machine / internet boundary.
- Learned the role of a reverse proxy in a production setup.
- Configured Nginx with basic security-related settings such as rate limiting, DoS mitigation, rejecting unnecessary HTTP methods, and suppressing default headers.
- Gained hands-on experience managing an AWS Lightsail instance via its GUI, including checking open ports and monitoring metrics.
- Learned how HTTPS is established using Certbot with the HTTP-01 challenge, how it integrates with Nginx, and how certificate renewal can be automated using cron.
- Learned the importance of instance resources on Lightsail after experiencing freezes caused by insufficient resources when running Docker containers, and began monitoring memory usage (`free`) and CPU load via metrics during and after deployment.


## Tech Stack
<table>
  <tr>
    <th>Backend</th>
    <td>
      <img src="https://img.shields.io/badge/Node.js-4C4D59.svg?logo=nodedotjs">
      <img src="https://img.shields.io/badge/Express-4C4D59.svg?logo=express">
      <img src="https://img.shields.io/badge/Prisma-4C4D59.svg?logo=prisma">
      <img src="https://img.shields.io/badge/MySQL-4C4D59.svg?logo=mysql">
    </td>
  </tr>
  <tr>
    <th>Frontend</th>
    <td>
      <img src="https://img.shields.io/badge/Next.js-4C4D59.svg?logo=nextdotjs&logoColor=efefef">
      <img src="https://img.shields.io/badge/Tailwind CSS-4C4D59.svg?logo=tailwindcss">
    </td>
  </tr>
  <tr>
    <th>Infrastructure</th>
    <td>
      <img src="https://img.shields.io/badge/Docker-4C4D59.svg?logo=docker">
      <img src="https://img.shields.io/badge/NGINX-4C4D59.svg?logo=nginx">
      <img src="https://img.shields.io/badge/Certbot-4C4D59">
      <img src="https://img.shields.io/badge/AWS Lightsail-4C4D59">
      <img src="https://img.shields.io/badge/Vercel-4C4D59.svg?logo=vercel">
    </td>
  </tr>
</table>


## License
This project was created for educational and portfolio use.  
Licensed under the [MIT License](./LICENSE).
