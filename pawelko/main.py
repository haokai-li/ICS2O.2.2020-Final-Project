import json
import os
import time
from random import randint

import keyboard
import pythoncom
import pyWinhook

# Getting configuration
with open("config.json", "r") as f:
    config = json.load(f)
preset = config["preset"]
history = config[preset]["history"]
threshold = config[preset]["threshold"]
timeout = config[preset]["timeout"]
shutdown = config[preset]["shutdown"]
sneak = config[preset]["sneak"]
logfile = config[preset]["logfile"]

# Defining variables
last_key = time.time()
history_array = []
caught = False
timing = None
pick = None
current = 0

print("GoodUSB is running :)")


# Gets called for each keystroke
def KeyDown(event):
    global last_key, preset, history, threshold, timeout, history_array
    global caught, hm

    # getting time diff
    time_diff = -1 * (last_key - time.time())
    history_array.append(time_diff)

    # check if caught
    if caught:
        caught = True
        return found(event)
    elif len(history_array) > history and not caught:
        history_array.pop(0)
        time_total = sum(history_array) / history
        if time_total < threshold:
            print("Detected INTRUSION!")
            last_key = time.time()
            caught = True
            return found(event)
        else:
            last_key = time.time()
            return True
    else:
        last_key = time.time()
        return True


def found(event):
    global timeout, caught, timing, sneak, pick
    global current, history_array

    if shutdown:  # if shutdown is true, shutdown PC
        print("Shutting down PC")
        os.system("shutdown /s /t 0")
    else:
        if not timing:  # timeout for x seconds
            timing = time.time()
            print(f"Locking keyboard for {timeout} seconds")
        elif (time.time() - timing) >= timeout:
            caught = False
            history_array = []
            timing = None
            return False

        if sneak:  # if quiet has value, sneak keys in
            # send keys randomly depending on sneak value
            current += 1
            if not pick:
                pick = randint(round(sneak / 2), sneak)
                print("Sneaking in keys(in this case backspace)")
            elif current == pick:
                keyboard.send("\b")
                pick = randint(round(sneak / 2), sneak)
                current = 0
            return True

        if logfile:  # if logfile send keys to logfile
            log(event)
            print("Logging attack")
        # block keyboard input
        return False


# log input
def log(event):
    global logfile

    with open(logfile, "a+") as file:
        if event.Key == "Space":
            file.write(" ")
        else:
            file.write(event.Key)
        file.close()


# Declaring hook manager
hm = pyWinhook.HookManager()
# To block keyboard
hm.KeyDown = KeyDown
# Set the hook
hm.HookKeyboard()
# Wait forever
pythoncom.PumpMessages()
