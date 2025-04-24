# Build a TEMU E-Commerce Store with NextJS 15, React 19, TypeScript | Full Stack Tutorial (2025)
0:00:00 - Demo and Project Overview
- https://www.youtube.com/watch?v=-_-kvPiMybw
- npm i zustand
- npm i zod
- npm i prisma -D
- npm i @prisma/client
0:01:51 - Project & Database Setup
- HE THEN SETUP WITH VERCEL
- import from github
- go to dashboard/project
- go to stroage; choose Neon
- choose a region; washington - continue
- default name:
- create
- choose all 3 environments
- connect
- create a .env file in the root folder
- in vercel, click "copy snippet" and paste in the .env
- in terminal: npx prisma init
- make sure prisma/schema and the prisma tab in vercel have the same info
```
datasource db {
  provider  = "postgresql"
  url  	    = env("DATABASE_URL")
}
```

- add to prisma/schema
```
model User {
  id Int @id @default(autoincrement())

}
```

- in terminal: npx prisma db push
- should be in sync with online
- npx prisma studio; and we should see the user database
- added a Inter font in the layout.tsx file

0:09:44 - Header
## ADDING STUFF
- create the src/components/layout folder
- created the navbar

0:27:38 - Auth & User System
## added auth with Lucia
- https://lucia-auth.com/sessions/basic-api/
- prisma; 
- update the prisma/schema
```
model User {
  id Int @id @default(autoincrement())

  email        String @unique
  passwordHash String

  sessions Session[]

}

model Session {
  id        String   @id
  userId    Int
  expiresAt DateTime

  user User @relation(references: [id], fields: [userId], onDelete: Cascade)
}

```

- install dependencies: npm i @oslojs/encoding @oslojs/crypto
- create the src/actions/auth.ts file
- npx prisma generate
- create src/lib/prisma.ts
- npx prisma db push 
- added the Lucia cookies as well
- https://lucia-auth.com/sessions/cookies/
- create the temu-store/middleware.ts file
- cookies go in the auth.ts
- BUILDING THE PAGES
- create app/auth/sign-in and sign-up with page.tsx
- create app/components/auth Signin and Signup
- npm install lucide-react
- if there is prisma errors
- update to: 
```
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient()
```

- add to the home page, to see if a user is logged in
```
import Image from "next/image";
import { getCurrentSession } from "@/actions/auth";

// export default function Home() {
const Home = async () => {
  const { user } = await getCurrentSession();
  return (
    <>
      <h1>Home</h1>
      //this works for any query we want to see if it is working
      <h2>{JSON.stringify(user)}</h2>
    </>
  );
}

export default Home;
```
- refresh and test the sign up, logout, and login, 
- IT WORKS

1:24:00 - Sanity CMS Setup + Add products
- created account and project: temu-store
- dashboard/settings/api/cors; add cors origins
- add: http://localhost:3000; allow credentials
- npm i sanity -G
- npx sanity init
- in terminal: select the current app
- choose: production; configuration; typescript; emmbeded sanity; /studio; clean project; .env
- copy the stuff sanity added to .env.local to our .env
- delete .env.local
- update next.config.ts to add images from sanity
```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['cdn.sanity.io']
  }
};

export default nextConfig;

```

- add to the .env; NEXT_PUBLIC_SANITY_API_VERSION=vX
- create the src/sanity/schemaTypes/schemas/product-category.ts
- create the src/sanity/schemaTypes/schemas/product.ts
- create the src/sanity/schemaTypes/schemas/promotion-codes.ts
- create the src/sanity/schemaTypes/schemas/promotion-campaign.ts
- update sanity/index.ts
- in terminal: npx sanity deploy 
- give it a name: temu-store-next
- i had sanity errors from copying his online, my schemas had to be:  from './schemas/order'
- go to localhost /studio
- login
- importing data he already made
- in directory put the file: [text](../next-temu-clone-video/production.tar.gz)
- npx sanity dataset import production.tar.gz
- production
- IT WORKED
- setting up sanity live, so when something updates locally it updates on the site
- dashboard/settings/api/tokens/
- add api token
- Live Update (as name); with 'viewer' permissions
- click save
- copy the token,
- add to .env
- SANITY_API_READ_TOKEN=""
- update sanity/lib/live
- npx sanity schema extract
- create dir/schema.json
- we need in ts
- npx sanity typegen generate
- creates sanity.types.ts
- update sanity/lib/client.ts
- had to update this to find the types file
```
// import { Product, ProductCategory } from '@/sanity.types'
import { Product, ProductCategory } from '../../../sanity.types'
```
- update tsconfig.json
```
    "paths": {
      "@/*": ["./src/*", "./*"]
    }
```
- we can put this back in client.ts
```
import { Product, ProductCategory } from '@/sanity.types'
// import { Product, ProductCategory } from '../../../sanity.types'
```
- GOT ERROR FROM CLIENT AND LIVE.ts
- had to copy the 'client' export from client.ts and put it in live.ts
- IT WORKED, I See tHE PRODUTCTS

1:50:07 - Home Page
- create components/layout/SalesCampaignBanner.tsx
- and added the products to the app/page.tsx

2:09:40 - Category Page
- added the category selector to the header
- updated the components/headercategory selector file
- create the app/category/[slug]/page
- refresh the home page and test out the category dropdown
- IT WORKED

2:30:33 - Search Feature
- search in the header
- components/layout/headersearch bar
- create app/search/page
- refresh home page, IT WORKED

2:41:13 - Product Page
- create src/app/product/[id]/page
- add lib/utils
- add cart buttons, product/addtocartbutton

3:13:18 - Sliding Cart Feature
- create src/stores/cart-store.ts
- update prisma/schema with all the final models
- stop server
- npx prisma db push
- npm run dev
- add src/actions/cart-actions.ts
- create components/cart/Cart.tsx
- add it to app/layout
- update header to show the cart
- refresh and test out: IT WORKED


5:01:02 - Payments with Stripe & Sanity
- go to sanity/api
- add new token; Editing Token; Editor
- copy token and add to .env; SANITY_API_WRITE_TOKEN=""
- create sanity/schematypes/schemas/order.ts
- add to the schematypes/index , the order stuff
- npx sanity schema extract
- npx sanity typegen generate
- npm run dev
- SETTING UP STRIPE
- add to .env: STRIPE_SECRET_KEY=""
- go to vercel/deployment
- click on the app created
- copy the domain link with the globe icon: https://next-temu-ecommerce.vercel.app/
- in stripe dashboard, search: webhooks
- create an event destination
- endpoint url: https://next-temu-ecommerce.vercel.app/api/stripe/webhook
- description: stripe checkout completed webhook
- click: select events to listen to
- checkout session completed
- click: add events
- click: add endpoint
- copy the new 'signing secret'
- add to .env
- STRIPE_WEBHOOK_SECRET=""
- also add to .env: NEXT_PUBLIC_BASE_URL="http://localhost:3000"
- in vercel: click the name of the app on top of the deployment details page
- copy the globe icon link again
- go to project settings/environment variables
- copy the entire .env code
- in vercel paste in the 'client key' to add all the keys there
- replace the next public base url, with the vercel one: https://next-temu-ecommerce.vercel.app
- hit save
- in terminal: npm i stripe (he did npm i stripe --legacy-peer-deps)
- create the file: actions/stripe-actions.ts
- make sure the 'apiversion' is correct, if not quick fix to match the one we have
- update Cart.tsx with the 'createCheckoutSession' and the checkouturl
- npm run dev
- go to store, add products, click proceed to checkout
- we should be routed to stripe checkout (dont chekcout yet)
- create the file: src/app/api/stripe/webhook/route.ts

6:09:00 - Spinning Wheel of Fortune Feature
7:47:16 - Conversion Tracking & Analytics