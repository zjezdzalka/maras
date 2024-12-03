# Use a base image with bun installed
FROM oven/bun:latest as base

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
FROM base as install
# Install Python for node-gyp
RUN apt-get update && apt-get install -y python3 make g++
COPY package.json bun.lockb ./
RUN bun install

# [optional] tests & build
ENV NODE_ENV=production
RUN bun test

# Copy production dependencies and source code into final image
FROM base as release
WORKDIR /usr/src/app
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .

# Change ownership of the working directory to the 'bun' user
RUN chown -R bun:bun /usr/src/app

# Run the app
USER bun
EXPOSE 3001
RUN rm -f ./sqlite.db && bun run schemas && bun run migrate && bun run seed
ENTRYPOINT [ "bun", "run", "dev" ]
