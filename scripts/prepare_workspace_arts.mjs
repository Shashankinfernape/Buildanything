import fs from 'fs';
import crypto from 'crypto';

function makeArtifact(pngPath, outPath) {
  const buf = fs.readFileSync(pngPath);
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
  const art = {
    sha256,
    bytes: buf.length,
    media_type: 'image/png',
    data_base64: buf.toString('base64')
  };
  fs.writeFileSync(outPath, JSON.stringify(art, null, 2));
  console.log(`Created artifact: ${outPath} (sha: ${sha256.slice(0, 8)}..., bytes: ${buf.length})`);
}

makeArtifact('analysis/screens/live_workspace_settings.png', 'work/captures/live_workspace_settings_art.json');
makeArtifact('analysis/screens/live_workspace.png', 'work/captures/live_workspace_art.json');
