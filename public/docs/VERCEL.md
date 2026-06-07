**Current plan**
- Transfer ownership of this repository over to Austin, maintaining
me as an admin-level contributor
- Setting Austin's Vercel account up
- Austin creates Vercel project pulling from his new repository
- Austin grants me a Vercel Access Token
- I use Vercel CLI to make repo modifications and shit

**Access Token scopes**
- Grants CLI complete authority to act as Austin
- That means modification, addition, editing of any project
- Access to environment variables
- domain controls I think?

**Access Token restrictions**
- Can't access billing, delete account, etc
- No Vercel Marketplace
- Token expires over time (grant it for a year and then renew it if necessary, nbd)
- Some file upload limits (<100MB)

**How-to**
- Vercel Dashboard -> Account Settings -> Tokens
- Create token
- `Developer-CLI-Token`
- Scope: personal account
- Expiration: as long as possible

**Also**
- I dropped off PC for a couple days
- Have paperwork they gave me in my car