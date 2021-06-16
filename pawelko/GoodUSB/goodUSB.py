import json
import os
import time
from random import randint

import keyboard
import pythoncom
import pyWinhook

# Getting configuration
with open("C:/Program Files/GoodUSB/config.json", "r") as f:
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
    
    if event.Injected != 0:  # if keys are injected(auto type software)
        return True
    
    if shutdown:  # if shutdown is true, shutdown PC
        os.system("shutdown /s /t 0")
    else:
        if not timing:  # timeout for x seconds
            timing = time.time()
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
            elif current == pick:
                keyboard.send("\b")
                pick = randint(round(sneak / 2), sneak)
                current = 0
            return True

        if logfile:  # if logfile send keys to logfile
            log(event)
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


hm = pyWinhook.HookManager()
hm.KeyDown = KeyDown
hm.HookKeyboard()
pythoncom.PumpMessages()
