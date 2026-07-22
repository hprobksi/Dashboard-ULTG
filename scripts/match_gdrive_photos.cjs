const fs = require('fs');
const path = require('path');
const os = require('os');

const gdrivePhotosDir = path.join(process.cwd(), 'public', 'gdrive_photos');
const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
const masterOverrideFile = path.join(process.cwd(), 'data', 'master-pegawai.json');

// Ensure avatars dir exists
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

async function matchPhotos() {
  if (!fs.existsSync(gdrivePhotosDir)) {
    console.log("No gdrive_photos directory found.");
    return;
  }

  let pegawaiList = [];
  try {
    if (fs.existsSync(masterOverrideFile)) {
      pegawaiList = JSON.parse(fs.readFileSync(masterOverrideFile, 'utf8'));
    } else {
      console.log("Master pegawai JSON not found.");
      return;
    }
  } catch (e) {
    console.error("Error reading master_pegawai.json", e);
    return;
  }

  const files = fs.readdirSync(gdrivePhotosDir);
  console.log(`Found ${files.length} files in gdrive_photos.`);

  let matchCount = 0;

  for (let pegawai of pegawaiList) {
    const nama = pegawai.nama.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!nama) continue;

    // Find all files that contain the employee's name (normalized)
    const matches = files.filter(f => {
      const normalizedFilename = f.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedFilename.includes(nama);
    });

    if (matches.length > 0) {
      // Prioritize front-facing. Assume (1) is front, or no number is front.
      matches.sort((a, b) => {
        const a1 = a.includes('(1)');
        const b1 = b.includes('(1)');
        if (a1 && !b1) return -1;
        if (!a1 && b1) return 1;

        const aHasNumber = /\(\d\)/.test(a);
        const bHasNumber = /\(\d\)/.test(b);
        if (!aHasNumber && bHasNumber) return -1;
        if (aHasNumber && !bHasNumber) return 1;

        return 0;
      });

      const bestMatch = matches[0];
      console.log(`Matched ${pegawai.nama} -> ${bestMatch}`);

      const ext = path.extname(bestMatch) || '.jpg';
      const newFilename = `avatar_${pegawai.id.replace(/[^a-zA-Z0-9-]/g, '')}_${Date.now()}${ext}`;
      
      // Copy file to avatars
      fs.copyFileSync(
        path.join(gdrivePhotosDir, bestMatch),
        path.join(avatarsDir, newFilename)
      );

      // Update pegawai photo
      pegawai.photo = `/avatars/${newFilename}`;
      matchCount++;
    }
  }

  // Save updated list
  fs.writeFileSync(masterOverrideFile, JSON.stringify(pegawaiList, null, 2));
  console.log(`Successfully matched and updated ${matchCount} employees.`);
}

matchPhotos();
