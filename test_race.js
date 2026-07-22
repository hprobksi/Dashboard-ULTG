async function run() { 
  console.log('Starting stress test...'); 
  const promises = []; 
  for (let i = 0; i < 10; i++) { 
    promises.push(fetch('http://localhost:5173/api/lemburan', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ id: 'TEST-' + i, namaPekerjaan: 'Stress Test ' + i }) 
    })); 
  } 
  await Promise.all(promises); 
  console.log('Done! Check lemburan.json'); 
} 
run();
