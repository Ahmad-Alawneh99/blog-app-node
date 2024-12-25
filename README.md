# Blog app API

## Local setup
* create `.env` file and add the required secrets (shared by email)
* run `npm install`
* run `npm run dev`
* access the app at `http://localhost:3030`

## Deployment
* Deployed using Vercel
* you can access a deployed version of the backend here: https://blog-app-node-one.vercel.app/
* note: the deployment is a bit slow, Vercel is not the best option for backend apps

## CI/CD
In addition to the Vercel deployment, Github actions were set for ESLint and unit tests, you can view these actions on this PR: https://github.com/Ahmad-Alawneh99/blog-app-next/pull/1.
Scroll down to the bottom, and expand the list of actions

## Project documentation
https://docs.google.com/document/d/1mmJjnAqzExPbil5-lwCS5mQCrosBAXdueY5HhtrJZPY

### Important note: `dist` directory should normally not be pushed to github, I needed to do so in this case in order for the Vercel deployment to work

### Another note: the Vercel deployment is a bit slow when it comes to the backend, since Vercel is not really built for backend apps, but it is the only free reliable option
