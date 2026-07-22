import sys

file_path = 'server/python_backend/api.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target_block = """def run_dfr_clean_task(task_id: str, req: DfrCleanRequest):
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
    }"""

replacement_block = """def run_dfr_clean_task(task_id: str, req: DfrCleanRequest):
    tasks = app_state["dfr_clean_tasks"]
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        folders_to_clean = ["logs", "pq", "ddrt", "dfr", "css"]
        total_steps = len(folders_to_clean) + 2
        
        tasks[task_id]["current_step"] = 1
        tasks[task_id]["status"] = f"Menghubungkan SSH ke {req.ip}..."
        ssh.connect(req.ip, username=req.username, password=req.password, timeout=15)
        
        for i, folder in enumerate(folders_to_clean):
            tasks[task_id]["current_step"] = 2 + i
            tasks[task_id]["status"] = f"Sedang membersihkan /home/{folder}..."
            _, stdout, stderr = ssh.exec_command(f"rm -rf /home/{folder}/*")
            # Wait for command to finish
            stdout.channel.recv_exit_status()
            
        tasks[task_id]["current_step"] = total_steps
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
        "current_step": 0,
        "total_steps": 7,
        "done": False,
        "error": False
    }"""

content = content.replace(target_block, replacement_block)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('api.py patched successfully')
