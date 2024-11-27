# Clear old builds
rm -rf dist
rm -rf layer

# Create layer directory
mkdir -p layer
cd layer
cp ../package.json .
npm install --production
cd ..

# Build TypeScript
tsc

# Deploy
# serverless deploy