# DECISIONS

This document records my decisions during the development of this project.
Each decisions includes context, alternatives considered, and the reasoning behind the final choice.

---

## Disclaimer

The main criterion guiding my decisions was the intention to demonstrate as much as possible my technical ability, decision-making process, and delivery capacity.  
Many of the chosen approaches were selected because they would provide more "substance" for the source code to be evaluated.  

Because of this, I am fully aware that, given this is a quick demonstration project with no future updates, there is a certain level of over-engineering.  
To be transparent, I was conscious of this from the very first moment of planning, and I accepted it as part of the project’s goals.

## Stack

I considered different levels of complexity for the stack: from a very simple frontend project integrated with a fully managed serverless platform (such as Firebase), to a complete Turborepo setup with isolated apps and shared packages.  

Based on my conversation with O. and the Job Description, I concluded that the stack should reflect technologies close to those used by the company. Both Fastify, Prisma, and Vue.js were mentioned directly or implied, which strongly influenced the final decision.  

**Decision:**  
I decided to build two separate projects: an API and a WebApp.  

- **API:** Developed with **Fastify**, **TypeScript**, and **Prisma ORM**, following a REST pattern.  
  I opted for **Supabase** to provide Database and Storage, mainly because of its free plan.  

- **WebApp:** Developed with **Vue.js**.  
  For state management I chose **Pinia**, since it is the currently recommended solution by the Vue ecosystem.  

**Alternatives Considered:**  
- **Frontend-only + Firebase:** simpler and faster, but with less room to demonstrate architectural skills and technical depth.  
- **Full Turborepo (multiple apps + shared packages):** powerful and scalable, but too heavy for a short demo project.  

**Consequences:**  
- **Positive:**  
  - Stack aligned with technologies mentioned in the JD.  
  - Demonstrates architectural decision-making and modularization.  
  - Clear separation between backend and frontend.  
- **Negative / Technical Debt:**  
  - Some level of over-engineering for a demo project.  
  - Increased setup and maintenance complexity compared to simpler alternatives.

## Authentication / Authorization  

I implemented an authentication middleware in the API that protects all project routes.  
The token is fixed, hardcoded, and provided through an environment variable.  
The purpose of this feature was only to prevent misuse of the API in case its address becomes public for any reason.