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

The **API + WebApp split** would not be my default choice for a real project that was guaranteed not to grow beyond initial requirements.  
In that case, I would probably have chosen a serverless solution.  
The final decision with some degree of over-engineering was purely to provide more material for evaluation purposes.  

## Authentication / Authorization  

I implemented an authentication middleware in the API that protects all project routes.  
The token is fixed, hardcoded, and provided through an environment variable.  
The purpose of this feature was only to prevent misuse of the API in case its address becomes public for any reason.

## Project Structure

#### API

I decided to structure the API following a **Controller / Service / Repository** pattern in order to keep the code well organized, easy to understand and maintain, with clearly defined responsibilities.  
For entity management, I chose to rely on **PrismaClient** itself to handle the `Contact` model, instead of creating a custom abstraction on top of it.

#### WEBAPP

In the WebApp I mostly followed the conventions proposed by Vue.  
In some cases, where I considered it necessary to isolate code for better organization, I tried to mirror or standardize it as much as possible with the backend (types, utils, validations, ...).  

Within the available time, I also aimed to separate components as much as possible, with the goal of keeping each component lightweight, with fewer responsibilities, and as atomic as I could.

## Other Decisions

- Applied **Zod** for input validation due to its simplicity and strong TypeScript integration.
- Opted for **Pinia** as state management (instead of Vuex) since it is the officially recommended solution.
- Used **CSS utility classes (Tailwind)** for faster UI development.
- Stored environment variables with **dotenv** for local development.  
- Created routes for the **contact creation and edit modals**, so these features could be accessed directly via URL.  
- Chose not to generate a slug for contacts and instead used their **UUID** as the reference for the edit modal.  
  Since this would theoretically be an internal-use project (with no contact profiles being shared), keeping it simple was preferred.  
- Added a feature to **archive contacts**, allowing a user to archive before permanently deleting.  
  This gives the possibility of recovering a contact that was deleted by mistake.  
- Decided to keep everything in a **single store** for simplicity (all logic still relates to contacts, whether displaying or manipulating).  
  Time constraints also influenced this decision 😅.  
- Implemented **Light/Dark mode** support, but only following the user’s OS settings.  
  A manual theme toggler was not implemented due to lack of time.  