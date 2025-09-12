# Technical Debt & Known Improvements

This file was created to document the technical debts and known improvements for the project.  
These items were left out for at least one of the following reasons: avoiding even more over-engineering, lack of available time, or adding excessive features that would deviate too much from the project’s intended scope.

---

## Major Debts

### UNIT TESTS

Not implementing unit tests was honestly the part that made me most frustrated about the project.  
I had initially planned to write the tests after finishing the project, since I didn’t know exactly how the structure would evolve during development.  
This decision was made to avoid the need for constant test adjustments and to dedicate more time to core functionality.  

In the end, since the development ended up taking almost 9 hours, I had no time left to write tests and ensure coverage.  
I even attempted to use Claude Code to generate some tests for me, but since that would still exceed the proposed time frame for the challenge, I followed the recommendation of submitting *whatever I have* 😅.  

### API RATE LIMITING & CACHE

To improve performance and also optimize server resource usage, an API rate limiter and some basic caching strategy could have been helpful.  
Due to lack of time, and to avoid adding unnecessary complexity, I chose not to implement them.  

---

## Minor Debts / Improvements

1. Some resources or silent errors can leave orphaned files in Supabase storage.  
2. Some classes, functions, or components perform tasks that could ideally be abstracted into helpers, utils, or composables for better code organization and best practices.  
   For example, creating `BaseServices` or `BaseRepositories` would not have been justified given that the project only had one entity.  
3. Permanent contact deletion is currently validated using the browser’s native confirmation dialog.  
   Implementing a proper confirmation flow that matches the project’s UI would be more ideal.  
4. To improve page-loading visibility and provide a more modern UI, skeleton loaders could have been added.  
5. Some definitions are redundant, such as the `Contact` structure.  
   Using tRPC or another solution to guarantee consistency between the backend and frontend models would have been ideal.  