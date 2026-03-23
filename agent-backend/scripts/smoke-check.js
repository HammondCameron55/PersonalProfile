const baseUrl = process.env.AGENT_BASE_URL || "http://localhost:8787";

async function run() {
  const response = await fetch(`${baseUrl}/api/agent/health`);
  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }
  const json = await response.json();
  console.log(JSON.stringify(json, null, 2));
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
