
#!/usr/bin/env bash
set -e
echo "==> Building Flutter Web from ../mobile"
cd ../mobile
flutter config --enable-web
flutter pub get
flutter build web --dart-define=API_BASE=${API_BASE:-https://magellan.koyeb.app/api} --dart-define=SOCKET_BASE=${SOCKET_BASE:-https://magellan.koyeb.app}
cd -
mkdir -p web/build
rm -rf web/build/web
cp -r ../mobile/build/web web/build/

echo "==> Deploying to Firebase Hosting"
cd web
if ! command -v firebase >/dev/null 2>&1; then npm i -g firebase-tools; fi
firebase login --no-localhost || true
firebase use magellan || firebase projects:create magellan || true
firebase deploy --only hosting
echo "==> Hosting deployed."
