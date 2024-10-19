This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Live link: https://3220-team-13.vercel.app/

## Running locally

First, install the dependencies:

```bash
npm i
# or
yarn
```
Then, start the development server:

```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Connecting to production database

**This is not a good way of doing this!**

Right now, there is no local database setup (might set it up if needed), so all queries and mutations need to be done to the production server. You need to setup the environment variables to point to the Vercel database.

First, head to the root directory of the project and create a file exactly named: ```.env.development.local```
![image](https://github.com/user-attachments/assets/ab4f0cc9-f4fe-42d8-a2fa-99a191e5db6f)

Then, go to #environment-variables in our Discord and copy all the hidden variables sent.
![image](https://github.com/user-attachments/assets/15bbc47e-5a7a-4011-838c-a1556e7abbbd)

Paste it in your newly created file and save.
![image](https://github.com/user-attachments/assets/65f939c4-2e22-417f-bce9-ae0b60915554)

_Note: The environment variables will automatically be populated by Vercel when the website is deployed, so this doesn't need to be done for a deployement._
