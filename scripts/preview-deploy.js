const { execSync } = require('child_process')
const { writeFileSync } = require('fs')

// Get PR number from environment variable
const prNumber = process.env.PR_NUMBER
if (!prNumber) {
  console.error('PR_NUMBER environment variable is required')
  process.exit(1)
}

// Create a unique subdomain for the preview
const previewSubdomain = `pr-${prNumber}-health-stats-tracker`

// Update render.yaml for preview deployment
const renderConfig = `
services:
  - type: web
    name: ${previewSubdomain}
    env: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        sync: false
      - key: VITE_API_TIMEOUT
        value: 30000
      - key: VITE_ENABLE_MOCK_DATA
        value: false
    routes:
      - type: rewrite
        source: /api/*
        destination: https://api.health-stats-tracker.onrender.com/:splat
      - type: rewrite
        source: /*
        destination: /index.html
`

// Write the preview configuration
writeFileSync('render.yaml', renderConfig)

// Deploy to Render
try {
  execSync(\`curl -X POST "\${process.env.RENDER_DEPLOY_HOOK_URL}"\`, {
    stdio: 'inherit',
  })
  console.log(\`Preview deployment started for PR #\${prNumber}\`)
  console.log(\`Preview URL: https://\${previewSubdomain}.onrender.com\`)
} catch (error) {
  console.error('Failed to trigger preview deployment:', error)
  process.exit(1)
}
