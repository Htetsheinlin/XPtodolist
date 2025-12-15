# Deployment Guide

This guide explains how to deploy the Todo List application to production. We'll cover deploying to Vercel (recommended for Next.js) and alternative deployment options.

## Prerequisites

- Completed [Setup Guide](./SETUP.md)
- Firebase project configured (see [Firebase Setup Guide](./FIREBASE_SETUP.md))
- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (free tier available)

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Application works locally (`npm run dev`)
- [ ] All environment variables are documented
- [ ] Firebase security rules are deployed
- [ ] Code is committed to Git repository
- [ ] No sensitive data in code (use environment variables)
- [ ] Build succeeds (`npm run build`)

## Step 1: Build for Production

Test the production build locally:

```bash
npm run build
```

This command:
- Compiles TypeScript
- Optimizes React components
- Generates static pages where possible
- Creates `.next` folder with production build

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

If build fails, fix errors before deploying.

## Step 2: Deploy to Vercel (Recommended)

Vercel is the recommended platform for Next.js applications. It's created by the Next.js team and provides excellent integration.

### Option A: Deploy via Vercel Dashboard

1. **Sign up/Login**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Import Project**:
   - Click **"Add New..."** → **"Project"**
   - Import your Git repository
   - Select the repository containing your todo app

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `todolist` (if app is in subdirectory)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Environment Variables**:
   - Click **"Environment Variables"**
   - Add all Firebase config variables:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```
   - Select **Production**, **Preview**, and **Development** environments
   - Click **Save**

5. **Deploy**:
   - Click **"Deploy"**
   - Wait for deployment (2-5 minutes)
   - Vercel will build and deploy your app

6. **Access Your App**:
   - After deployment, you'll get a URL like: `your-app.vercel.app`
   - Click the URL to view your deployed app

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd todolist
   vercel
   ```
   - Follow prompts to link project
   - Add environment variables when prompted

4. **Set Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   # ... repeat for all variables
   ```

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**

2. **Add Domain**:
   - Enter your domain name
   - Follow DNS configuration instructions

3. **Update DNS**:
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation (up to 48 hours)

## Step 4: Update Firebase Authorized Domains

Firebase needs to know about your production domain for authentication to work.

1. Go to [Firebase Console](https://console.firebase.google.com/)

2. Select your project

3. Go to **Authentication** → **Settings** → **Authorized domains**

4. **Add Domain**:
   - Click **"Add domain"**
   - Enter your Vercel domain: `your-app.vercel.app`
   - If using custom domain, add that too
   - Click **Done**

5. **Verify**:
   - `localhost` should already be listed (for development)
   - Your production domain should now be listed

## Step 5: Verify Deployment

Test your deployed application:

1. **Visit your app URL**: `https://your-app.vercel.app`

2. **Test Authentication**:
   - Try signing up with a new account
   - Try signing in
   - Verify authentication works

3. **Test Todo Operations**:
   - Add a todo
   - Toggle completion
   - Delete a todo
   - Verify data persists

4. **Check Console**:
   - Open browser DevTools (F12)
   - Check for any errors
   - Verify Firebase connection

## Step 6: Continuous Deployment

Vercel automatically deploys when you push to Git:

1. **Push to Git**:
   ```bash
   git add .
   git commit -m "Update app"
   git push
   ```

2. **Automatic Deployment**:
   - Vercel detects the push
   - Builds and deploys automatically
   - Creates preview deployment for pull requests

3. **Production Deployment**:
   - Merging to main branch deploys to production
   - Or manually promote preview to production

## Alternative Deployment Options

### Netlify

1. Sign up at [netlify.com](https://netlify.com)
2. Connect Git repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables
5. Deploy

### Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Hosting**:
   ```bash
   firebase init hosting
   ```
   - Select existing project
   - Public directory: `.next`
   - Configure as single-page app: No
   - Set up automatic builds: No

3. **Build and Deploy**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

**Note**: Firebase Hosting requires additional Next.js configuration for server-side rendering. Vercel is easier for Next.js apps.

### Self-Hosting (VPS/Server)

1. **Build application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Use process manager** (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start npm --name "todo-app" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure reverse proxy** (Nginx):
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

5. **Set up SSL** (Let's Encrypt):
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

### Required Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Setting Variables in Vercel

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable
3. Select environments (Production, Preview, Development)
4. Redeploy after adding variables

## Post-Deployment Checklist

After deployment, verify:

- [ ] Application loads without errors
- [ ] Authentication works (sign up, sign in, sign out)
- [ ] Todos can be created, updated, and deleted
- [ ] Data persists across page refreshes
- [ ] Real-time sync works (test in multiple browsers)
- [ ] No console errors in browser DevTools
- [ ] Firebase authorized domains updated
- [ ] SSL certificate active (HTTPS)
- [ ] Performance is acceptable

## Monitoring and Analytics

### Vercel Analytics

Vercel provides built-in analytics:

1. Go to **Analytics** tab in Vercel dashboard
2. Enable Web Analytics
3. View page views, performance metrics

### Firebase Analytics

Firebase Analytics is automatically enabled if configured:

1. Go to Firebase Console → **Analytics**
2. View user events and behavior
3. Set up custom events if needed

### Error Monitoring

Consider adding error monitoring:

- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay and error tracking
- **Vercel Logs**: Built-in logging in Vercel dashboard

## Performance Optimization

### Next.js Optimizations

Next.js automatically optimizes:
- Code splitting
- Image optimization
- Font optimization
- Static page generation

### Additional Optimizations

1. **Enable Compression**:
   - Vercel handles this automatically
   - For self-hosting, configure Nginx/Apache

2. **CDN**:
   - Vercel uses global CDN automatically
   - Static assets served from edge locations

3. **Caching**:
   - Next.js handles caching automatically
   - Firestore queries are cached client-side

## Troubleshooting Deployment

### Issue: Build fails on Vercel

**Solutions**:
- Check build logs in Vercel dashboard
- Verify `package.json` has correct scripts
- Ensure all dependencies are listed
- Check for TypeScript errors locally first

### Issue: Environment variables not working

**Solutions**:
- Verify variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables
- Verify `NEXT_PUBLIC_` prefix is present

### Issue: Authentication not working in production

**Solutions**:
- Verify production domain is in Firebase authorized domains
- Check environment variables are set correctly
- Verify Firebase project is correct
- Check browser console for errors

### Issue: Firestore permission errors

**Solutions**:
- Verify security rules are deployed
- Check rules allow authenticated users
- Verify user is authenticated (check `auth.currentUser`)
- Review Firestore rules in Firebase Console

## Rollback Deployment

If something goes wrong:

### Vercel Rollback

1. Go to **Deployments** tab
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

### Git Rollback

1. Revert to previous commit:
   ```bash
   git revert HEAD
   git push
   ```
2. Vercel will automatically redeploy

## Security Considerations

1. **Environment Variables**:
   - Never commit `.env.local` to Git
   - Use hosting platform's environment variable system
   - Rotate API keys if exposed

2. **Firebase Security Rules**:
   - Always use security rules
   - Test rules thoroughly
   - Review rules regularly

3. **HTTPS**:
   - Always use HTTPS in production
   - Vercel provides SSL automatically
   - Firebase requires HTTPS for some features

4. **API Keys**:
   - Firebase API keys are meant to be public
   - Security comes from Firestore rules, not hiding keys
   - Don't store sensitive data in `NEXT_PUBLIC_` variables

## Cost Considerations

### Vercel Free Tier

- Unlimited deployments
- 100 GB bandwidth/month
- Automatic SSL
- Global CDN
- Perfect for small projects

### Firebase Free Tier

- 50K Firestore reads/day
- 20K writes/day
- Unlimited authentication
- Sufficient for learning and small apps

## Next Steps

After successful deployment:

1. Share your app URL with others
2. Monitor usage and performance
3. Set up custom domain (optional)
4. Configure analytics
5. Set up error monitoring
6. Plan for scaling if needed

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

Your application is now deployed and accessible to users worldwide! 🚀

