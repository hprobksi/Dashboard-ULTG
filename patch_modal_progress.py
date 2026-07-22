import sys

file_path = 'src/components/DfrCleanModal.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 1: Add state variables
target_state = """  const [isDone, setIsDone] = useState(false);
  const [isError, setIsError] = useState(false);"""
replacement_state = """  const [isDone, setIsDone] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(1);"""

content = content.replace(target_state, replacement_state)

# Replace 2: Update state on API response
target_api = """            const data = await res.json();
            setStatusMessage(data.status);
            if (data.done) {"""
replacement_api = """            const data = await res.json();
            setStatusMessage(data.status);
            setCurrentStep(data.current_step || 0);
            setTotalSteps(data.total_steps || 1);
            if (data.done) {"""

content = content.replace(target_api, replacement_api)

# Replace 3: Reset state
target_reset = """    setStatusMessage('');
    setIsDone(false);
    setIsError(false);
    setPassword('');"""
replacement_reset = """    setStatusMessage('');
    setIsDone(false);
    setIsError(false);
    setPassword('');
    setCurrentStep(0);
    setTotalSteps(1);"""

content = content.replace(target_reset, replacement_reset)

# Replace 4: Render progress bar
target_render = """              {isCleaning ? (
                <Loader2 size={48} color="#00A2E9" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
              ) : isError ? (
                <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 16px auto' }} />
              ) : (
                <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 16px auto' }} />
              )}"""

replacement_render = """              {isCleaning ? (
                <div style={{ marginBottom: '24px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                    <span>Proses Pembersihan</span>
                    <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(currentStep / totalSteps) * 100}%`, 
                      height: '100%', 
                      backgroundColor: '#00A2E9',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ) : isError ? (
                <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 16px auto' }} />
              ) : (
                <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 16px auto' }} />
              )}"""

content = content.replace(target_render, replacement_render)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Modal progress patched successfully')
