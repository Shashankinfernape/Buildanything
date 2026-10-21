#!/bin/bash
set -e

export REA_WAKARU_COMMAND=/root/.local/bin/wakaru
export REA_JAVASCRIPT_PRLIMIT_COMMAND=/usr/bin/prlimit

mkdir -p /abs/work/replit/recovered-chunks /abs/work/replit/recovered-modules-combined

TOTAL=$(find /abs/work/replit/exported-scripts/files -type f -name '*.js' | wc -l)
COUNT=0
SUCCESS=0

echo "Starting recovery of $TOTAL JavaScript chunks..."

find /abs/work/replit/exported-scripts/files -type f -name '*.js' | while read -r bundle; do
  COUNT=$((COUNT + 1))
  base="$(basename "$bundle" .js)"
  out_dir="/abs/work/replit/recovered-chunks/$base"

  # Skip if already unpacked
  if [ -d "$out_dir/modules" ] && [ "$(ls -A "$out_dir/modules" 2>/dev/null)" ]; then
    echo "[$COUNT/$TOTAL] Skipping already processed: $base"
  else
    rm -rf "$out_dir"
    mkdir -p "$(dirname "$out_dir")"
    
    echo "[$COUNT/$TOTAL] Unpacking $base..."
    if rea recover-javascript-sources "$bundle" "$out_dir" \
      --extraction-mode structural \
      --rewrite-level standard \
      --format json > "/abs/work/replit/recovered-chunks/${base}-report.json" 2>&1; then
      SUCCESS=$((SUCCESS + 1))
    else
      echo "Notice: Non-bundle or failed recovery for $base, trying fallback..."
      # If single module, copy as-is or Wakaru standalone
      /root/.local/bin/wakaru -o "$out_dir/modules/$base.js" --level standard "$bundle" 2>/dev/null || true
    fi
  fi

  if [ -d "$out_dir/modules" ]; then
    for mod in "$out_dir/modules/"*; do
      if [ -f "$mod" ]; then
        cp "$mod" "/abs/work/replit/recovered-modules-combined/${base}__$(basename "$mod")" 2>/dev/null || true
      fi
    done
  fi
done

TOTAL_MODS=$(find /abs/work/replit/recovered-modules-combined -type f | wc -l)
echo "Done! Extracted $TOTAL_MODS modules into /abs/work/replit/recovered-modules-combined"
