#!/bin/bash
# Build script for Todo List PWA

echo "Building Todo List PWA for Cloudflare Workers deployment..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy all necessary files to dist directory
cp index.html styles.css app.js manifest.json sw.js icon-512x512.svg dist/

# Create a simple index.html in src directory to be used by worker
cat > src/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Redirect to root</title>
</head>
<body>
    <p>If you're seeing this, there was an issue with the worker.</p>
</body>
</html>
EOF

echo "Build completed successfully!"
echo "Files in dist directory:"
ls -la dist/