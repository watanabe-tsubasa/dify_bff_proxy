# Dify BFF Proxy

This project implements a Backend-for-Frontend (BFF) proxy using Hono on Cloudflare Workers. Its primary purpose is to receive POST requests and forward them to the Dify AI API, handling API key management securely via Cloudflare Workers secrets.

## Features

-   **Dify API Proxy**: Forwards POST requests to `https://api.dify.ai/v1/workflows/run`.
-   **Secure API Key Handling**: Dify API key is managed as a Cloudflare Worker secret (`DIFY_API_KEY`).
-   **Streaming Response**: Supports streaming responses from the Dify API.
-   **Health Check Endpoint**: A simple GET endpoint (`/`) for health checks.
-   **Built with Hono**: Lightweight and fast web framework for Workers.
-   **Deployed on Cloudflare Workers**: Serverless deployment for scalability and low latency.

## Prerequisites

-   [Node.js](https://nodejs.org/)
-   [npm](https://www.npmjs.com/)
-   [Cloudflare Account](https://www.cloudflare.com/)
-   [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/)

## Setup

1.  **Clone the repository (or create the project if you haven't already):**

    ```bash
    # If you are creating a new project
    npm create cloudflare@latest dify-bff-proxy -- --framework=hono
    cd dify-bff-proxy
    ```

    If you already have the project, navigate to its root directory:

    ```bash
    cd dify-bff-proxy
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Dify API Key:**

    The Dify API key should be stored as a Cloudflare Worker secret. You will set this up for both local development and production deployment.

    -   **For Local Development:**

        ```bash
        npx wrangler secret put DIFY_API_KEY
        # When prompted, enter your Dify API key (e.g., app-xxxxxxxxxxxxxxxxxxxx)
        ```

    -   **For Production Deployment:**

        ```bash
        npx wrangler secret put DIFY_API_KEY --env production
        # When prompted, enter your Dify API key
        ```

## Local Development

To run the BFF locally for development and testing:

```bash
npm run dev
```

This will start a local development server, usually accessible at `http://localhost:8787/`.

### Testing Locally

-   **Health Check (GET):**

    ```bash
    curl http://localhost:8787/
    # Expected output: {"ok":true}
    ```

-   **Dify API Proxy (POST):**

    ```bash
    curl -X POST http://localhost:8787/ \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "inputs": {"assessment": "test"},
        "user": "abc-123"
    }'
    ```

    Replace `"inputs": {"assessment": "test"}` and `"user": "abc-123"` with your actual Dify workflow inputs.

## Deployment

To deploy your BFF to Cloudflare Workers:

```bash
npm run deploy
```

Wrangler will deploy your Worker, and you will get a URL like `https://your-worker-name.your-account.workers.dev`.

### Testing Deployed Worker

-   **Health Check (GET):**

    ```bash
    curl https://your-worker-name.your-account.workers.dev/
    # Expected output: {"ok":true}
    ```

-   **Dify API Proxy (POST):

    ```bash
    curl -X POST https://your-worker-name.your-account.workers.dev/ \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "inputs": {"assessment": "test"},
        "user": "abc-123"
    }'
    ```

    Replace `https://your-worker-name.your-account.workers.dev` with your actual deployed Worker URL.

## Project Structure

```
dify-bff-proxy/
├── src/
│   └── index.ts         # Main Hono application logic
├── package.json         # Project dependencies and scripts
├── wrangler.jsonc       # Cloudflare Worker configuration
└── README.md            # This file
```

## License

This project is open-sourced under the MIT License. See the [LICENSE](LICENSE) file for details. (Note: A LICENSE file is not included in this example, but it's good practice to add one.)

curl -X POST 'https://dify-bff-proxy.t-watanabe423.workers.dev/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "inputs": {"assessment": "test"},
    "user": "abc-123"
}'