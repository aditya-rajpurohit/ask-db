#!/bin/bash
set -e  # exit if any command fails

# --- Step 0: Check for python3.11 ---
if ! command -v python3.11 &> /dev/null
then
    echo "❌ python3.11 not found. Please install it first (brew install python@3.11)."
    exit 1
fi

# --- Step 1: Create virtual environment ---
if [ ! -d "venv" ]; then
    echo "🔧 Creating virtual environment..."
    python3.11 -m venv venv
else
    echo "ℹ️  Virtual environment already exists."
fi

# --- Step 2: Activate virtual environment ---
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# --- Step 3: Upgrade pip, setuptools, wheel ---
echo "⬆️  Upgrading pip, setuptools, wheel..."
pip install --upgrade pip setuptools wheel

# --- Step 4: Install requirements ---
if [ -f "requirements.txt" ]; then
    echo "📦 Installing dependencies from requirements.txt..."
    pip install -r requirements.txt
else
    echo "⚠️  requirements.txt not found. Skipping installation."
fi

# --- Step 5: Success message ---
echo "✅ Environment setup complete!"
echo "👉 Virtual environment activated. You can now run Python commands inside it."