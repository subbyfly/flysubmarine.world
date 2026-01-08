cd /Users/scottmacdonald/.gemini/antigravity/brain/917a494e-eceb-416f-85c9-df77b76a9e5e/flysubmarine_site

# Initialise git (if you haven’t already)
git init

# Stage everything
git add .

# Commit
git commit -m "Initial FlySubmarine site"

# Add the remote you created on GitHub
# Replace <YOUR_REPO_URL> with the HTTPS or SSH URL you copied from GitHub
git remote add origin <YOUR_REPO_URL>

# Push to the remote main branch
git push -u origin main
