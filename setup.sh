#!/usr/bin/env bash
# NeuroSync — one-command local setup
set -e

echo ""
echo "🧠  NeuroSync Setup"
echo "-------------------"

# 1. Node deps
echo "→ Installing Node.js dependencies..."
npm install

# 2. Python brain service
echo "→ Setting up Python brain service..."
cd brain-service
python3 -m venv .venv
source .venv/bin/activate
pip install -q -r requirements.txt
echo "  Brain service ready (mock mode, no GPU required)"
deactivate
cd ..

# 3. Brain mesh
echo "→ Generating brain mesh asset..."
if [ ! -f "public/brain/fsaverage5.json" ]; then
  cd brain-service
  source .venv/bin/activate
  python3 generate_mesh.py
  deactivate
  cd ..
  echo "  Brain mesh generated at public/brain/fsaverage5.json"
else
  echo "  Brain mesh already exists — skipping"
fi

# 4. Env file
if [ ! -f ".env.local" ]; then
  cp .env.local.example .env.local
  echo "→ Created .env.local from example — fill in your API keys"
else
  echo "→ .env.local already exists"
fi

echo ""
echo "✅  Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Fill in .env.local with your API keys (Clerk, Supabase, Cloudflare R2)"
echo "  2. Run DB migrations in Supabase SQL Editor (db/migrations/*.sql in order)"
echo "  3. Start the brain service:"
echo "       cd brain-service && source .venv/bin/activate && uvicorn main:app --reload"
echo "  4. Start the Next.js app:"
echo "       npm run dev"
echo "  5. Open http://localhost:3000"
echo ""
echo "  To enable real TRIBE v2 inference (GPU required):"
echo "    git clone https://github.com/facebookresearch/tribev2"
echo "    cd tribev2 && pip install -e '.[plotting]'"
echo "    TRIBE_MOCK=0 uvicorn main:app --reload"
echo ""
