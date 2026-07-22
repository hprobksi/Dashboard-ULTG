import sys

file_path = 'server/python_backend/api.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace 1: Add imports
target_import = "from fastapi import Cookie, Depends, FastAPI, Header, HTTPException, Query, Request, Response, Body"
replacement_import = "import paramiko\nfrom fastapi import Cookie, Depends, FastAPI, Header, HTTPException, Query, Request, Response, Body, BackgroundTasks"
content = content.replace(target_import, replacement_import)

# Replace 2: Add API endpoints
target_endpoint = """@app.post("/api/dfr/refresh", dependencies=[Depends(require_admin_session)])
def refresh_dfr_status():
    poll_dfr_once()
    return build_dfr_payload()"""

new_endpoints = """@app.post("/api/dfr/refresh", dependencies=[Depends(require_admin_session)])
def refresh_dfr_status():
    poll_dfr_once()
    return build_dfr_payload()

class DfrCleanRequest(BaseModel):
    device_id: str
    ip: str
    username: str
    password: str

def run_dfr_clean_task(task_id: str, req: DfrCleanRequest):
    tasks = app_state["dfr_clean_tasks"]
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        tasks[task_id]["status"] = f"Menghubungkan SSH ke {req.ip}..."
        ssh.connect(req.ip, username=req.username, password=req.password, timeout=15)
        
        folders_to_clean = ["logs", "pq", "ddrt", "dfr", "css"]
        for folder in folders_to_clean:
            tasks[task_id]["status"] = f"Sedang membersihkan /home/{folder}..."
            _, stdout, stderr = ssh.exec_command(f"rm -rf /home/{folder}/*")
            # Wait for command to finish
            stdout.channel.recv_exit_status()
            
        tasks[task_id]["status"] = "Sedang proses rebooting..."
        ssh.exec_command("reboot")
        
        ssh.close()
        tasks[task_id]["status"] = "Selesai (Rebooting)."
        tasks[task_id]["done"] = True
    except Exception as e:
        tasks[task_id]["status"] = f"Error: {str(e)}"
        tasks[task_id]["error"] = True
        tasks[task_id]["done"] = True

@app.post("/api/dfr/clean", dependencies=[Depends(require_admin_session)])
def start_dfr_clean(req: DfrCleanRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    if "dfr_clean_tasks" not in app_state:
        app_state["dfr_clean_tasks"] = {}
    
    app_state["dfr_clean_tasks"][task_id] = {
        "status": "Memulai...",
        "done": False,
        "error": False
    }
    background_tasks.add_task(run_dfr_clean_task, task_id, req)
    return {"task_id": task_id}

@app.get("/api/dfr/clean/status/{task_id}", dependencies=[Depends(require_admin_session)])
def get_dfr_clean_status(task_id: str):
    tasks = app_state.get("dfr_clean_tasks", {})
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks[task_id]"""

content = content.replace(target_endpoint, new_endpoints)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('api.py patched successfully')
