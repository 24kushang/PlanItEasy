# Clear old builds
rm -rf .esbuild .serverless dist

# Install dependencies
npm install

# Build with esbuild via Serverless
serverless package

# Deploy 
# serverless deploy --stage ${{ github.ref_name }}