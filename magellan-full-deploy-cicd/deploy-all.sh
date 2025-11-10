
#!/usr/bin/env bash
set -e
echo "================ Magellan: Full Online Deploy ================"

echo "[1/5] Backend setup"
pushd backend >/dev/null
./setup.sh
popd >/dev/null

echo "[2/5] Git init & push (optional)"
if [ ! -d ".git" ]; then
  git init
  git add .
  git commit -m "Magellan initial full deploy"
fi

echo "[3/5] Koyeb deploy (manual connect)"
echo "-> Push this repo to GitHub, then in https://www.koyeb.com create an app from your GitHub repo."
echo "-> Koyeb will read backend/koyeb.yaml automatically."
echo "-> Set env vars in Koyeb: DATABASE_URL (use Neon), JWT_SECRET, TAP_*"
echo

echo "[4/5] Build & Deploy Flutter Web to Firebase"
pushd web >/dev/null
./setup_web.sh
popd >/dev/null

echo "[5/5] Done"
echo "If Hosting succeeded, you'll see your web URL above."
echo "Remember to update API_BASE/ SOCKET_BASE to your Koyeb URL and redeploy web if needed."
