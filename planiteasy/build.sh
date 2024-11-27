# Clear old builds
rm -rf dist
rm -rf layer

# installing typescript
npm install typescript

# Create layer directory
mkdir -p layer
cd layer
cp ../package.json .
npm install --production
cd ..

# Build TypeScript
tsc

# Deploy
serverless deploy --stage ${{ github.ref_name }}