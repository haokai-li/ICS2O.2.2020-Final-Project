import pyWinhook

# Getting configuration
with open("config.json", "r") as f:
    config = json.load(f)
preset = config["preset"]
history = config[preset]["history"]
threshold = config[preset]["threshold"]

# defining variables
last_key = time.time()
history_array = []

# Gets called for each keystroke
def KeyDown(event):
    global history_array, history, threshold, last_key
    
    # getting time diff
    time_diff = -1 * (last_key - time.time())
    history_array.append(time_diff)
    if len(history_array) > history:
        history_array.pop(0)
        time_total = sum(history_array) / history
        if time_total < threshold:
              last_key = time.time()
              return False
            
            
hm = pyWinhook.HookManager()
hm.KeyDown = KeyDown
hm.HookKeyboard()
pythoncom.PumpMessages()
