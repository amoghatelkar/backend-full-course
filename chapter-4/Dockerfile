FROM node:22-alpine

# Create app directory with proper permissions
RUN mkdir -p /app && chown -R 1000:1000 /app
WORKDIR /app

# Copy package files first
COPY --chown=1000:1000 package*.json ./
COPY --chown=1000:1000 prisma ./prisma/

# Install as non-root
USER 1000
RUN npm install
RUN npx prisma generate

# Copy rest of files
COPY --chown=1000:1000 . .

EXPOSE 5003
CMD ["node", "./src/server.js"]