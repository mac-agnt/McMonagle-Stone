import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Version-skew protection: without this, a client that loaded the app
  // before a redeploy requests stale chunk/RSC assets after the redeploy,
  // the server 404s, and the click silently no-ops until a hard refresh.
  // With deploymentId set, a mismatch forces a full reload instead.
  deploymentId:
    process.env.NEXT_DEPLOYMENT_ID ||
    process.env.VERCEL_DEPLOYMENT_ID ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.GIT_SHA,
};

export default nextConfig;
