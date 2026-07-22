const { MmsClient } = require('@amigo9090/ih-libiec61850-node');

const JSON_START = '__VoltKraf_AVR_JSON_START__';
const JSON_END = '__VoltKraf_AVR_JSON_END__';

function readStdin() {
  return new Promise((resolve, reject) => {
    let buffer = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => {
      buffer += chunk;
    });
    process.stdin.on('end', () => resolve(buffer));
    process.stdin.on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function withFunctionalConstraint(reference, fc) {
  const cleanRef = String(reference || '').trim();
  const cleanFc = String(fc || '').trim().toUpperCase();
  if (!cleanRef || /\[[A-Z]{2}\]$/.test(cleanRef) || !cleanFc) {
    return cleanRef;
  }
  return `${cleanRef}[${cleanFc}]`;
}

async function main() {
  const payload = JSON.parse(await readStdin());
  const device = payload.device || {};
  const points = Array.isArray(payload.points) ? payload.points : [];
  const timeoutMs = Number(payload.timeout_ms || 8000);
  const clientId = `VoltKraf_${String(device.id || 'avr').replace(/[^a-zA-Z0-9_]/g, '_')}_${Date.now()}`;
  const readRefs = points.map(point => withFunctionalConstraint(point.reference, point.fc));
  const results = [];

  const client = new MmsClient(() => {});
  try {
    await client.connect({
      ip: String(device.ip || ''),
      port: Number(device.port || 102),
      clientID: clientId,
      reconnectDelay: 0,
    });
    await sleep(Math.min(1200, Math.max(250, Math.floor(timeoutMs / 4))));

    const rawResults = readRefs.length ? await client.readData(readRefs) : [];
    const normalizedResults = Array.isArray(rawResults) ? rawResults : [rawResults];
    for (let index = 0; index < points.length; index += 1) {
      const point = points[index] || {};
      const raw = normalizedResults[index] || {};
      const isValid = raw.isValid !== false && !raw.errorReason;
      results.push({
        index,
        group_name: point.group_name,
        point_index: point.point_index,
        key: point.key,
        reference: point.reference,
        read_reference: readRefs[index],
        is_valid: Boolean(isValid),
        value: isValid ? raw.value : null,
        error: isValid ? '' : String(raw.errorReason || raw.value || 'Data access error'),
      });
    }

    console.log(JSON_START);
    console.log(JSON.stringify({ ok: true, connected: true, results }));
    console.log(JSON_END);
  } catch (error) {
    console.log(JSON_START);
    console.log(JSON.stringify({
      ok: false,
      connected: false,
      error: error && error.message ? error.message : String(error),
      results,
    }));
    console.log(JSON_END);
    process.exitCode = 2;
  } finally {
    try {
      await client.close();
    } catch (error) {
      // Closing errors are not useful for the polling result.
    }
  }
}

main().catch(error => {
  console.log(JSON_START);
  console.log(JSON.stringify({
    ok: false,
    connected: false,
    error: error && error.message ? error.message : String(error),
    results: [],
  }));
  console.log(JSON_END);
  process.exitCode = 2;
});
